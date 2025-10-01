#!/usr/bin/env node

/**
 * Script para resetear contadores de uso mensualmente
 * 
 * Este script debe ejecutarse el día 1 de cada mes a las 00:00
 * 
 * Configuración cron:
 *   0 0 1 * * /usr/bin/node /path/to/scripts/reset-monthly-usage.js
 * 
 * O usando PM2:
 *   pm2 start scripts/reset-monthly-usage.js --cron "0 0 1 * *"
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Usar service role key para operaciones administrativas
);

async function resetMonthlyUsageCounters() {
  try {
    console.log('🔄 Iniciando reset de contadores mensuales...');
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    console.log(`📅 Procesando reset para ${lastMonthYear}-${lastMonth.toString().padStart(2, '0')}`);

    // Obtener todas las organizaciones activas
    const { data: organizations, error: orgError } = await supabase
      .from('workspaces')
      .select('id, name, plan')
      .neq('subscription_status', 'canceled');

    if (orgError) {
      throw new Error(`Error fetching organizations: ${orgError.message}`);
    }

    console.log(`📊 Procesando ${organizations.length} organizaciones...`);

    let processedCount = 0;
    let errorCount = 0;

    for (const org of organizations) {
      try {
        // Obtener contadores del mes anterior
        const { data: lastMonthUsage, error: usageError } = await supabase
          .from('usage_counters')
          .select('*')
          .eq('org_id', org.id)
          .eq('year', lastMonthYear)
          .eq('month', lastMonth)
          .single();

        if (usageError && usageError.code !== 'PGRST116') { // PGRST116 = no rows returned
          throw new Error(`Error fetching usage for org ${org.id}: ${usageError.message}`);
        }

        // Crear contadores para el mes actual si no existen
        const { error: createError } = await supabase
          .from('usage_counters')
          .upsert({
            org_id: org.id,
            year: currentYear,
            month: currentMonth,
            chats_used: 0,
            tokens_in: 0,
            tokens_out: 0,
            voice_minutes: 0,
          }, {
            onConflict: 'org_id,year,month'
          });

        if (createError) {
          throw new Error(`Error creating current month counter: ${createError.message}`);
        }

        // Log del reset para auditoría
        await supabase
          .from('agent_action_logs')
          .insert({
            org_id: org.id,
            tool: 'monthly_reset',
            args_sanitized: {
              reset_month: `${lastMonthYear}-${lastMonth.toString().padStart(2, '0')}`,
              previous_usage: lastMonthUsage || null,
              plan: org.plan
            },
            tokens_in: 0,
            tokens_out: 0,
            duration_ms: 0,
            model_used: 'system',
            cached: false
          });

        processedCount++;

        if (processedCount % 10 === 0) {
          console.log(`   ✅ Procesadas ${processedCount}/${organizations.length} organizaciones`);
        }

      } catch (error) {
        console.error(`❌ Error procesando organización ${org.id}:`, error.message);
        errorCount++;
      }
    }

    // Limpiar cache expirado
    console.log('🧹 Limpiando cache expirado...');
    const { data: deletedCache, error: cacheError } = await supabase
      .from('agent_cache')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('id');

    if (cacheError) {
      console.error('❌ Error limpiando cache:', cacheError.message);
    } else {
      console.log(`   🗑️  Eliminadas ${deletedCache?.length || 0} entradas de cache expiradas`);
    }

    // Limpiar logs antiguos (más de 90 días)
    console.log('🧹 Limpiando logs antiguos...');
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90);

    const { data: deletedLogs, error: logsError } = await supabase
      .from('agent_action_logs')
      .delete()
      .lt('created_at', cutoffDate.toISOString())
      .select('id');

    if (logsError) {
      console.error('❌ Error limpiando logs:', logsError.message);
    } else {
      console.log(`   🗑️  Eliminados ${deletedLogs?.length || 0} logs antiguos`);
    }

    console.log('\n✅ Reset mensual completado!');
    console.log(`📊 Estadísticas:`);
    console.log(`   - Organizaciones procesadas: ${processedCount}`);
    console.log(`   - Errores: ${errorCount}`);
    console.log(`   - Cache limpiado: ${deletedCache?.length || 0} entradas`);
    console.log(`   - Logs limpiados: ${deletedLogs?.length || 0} entradas`);

  } catch (error) {
    console.error('❌ Error en reset mensual:', error.message);
    throw error;
  }
}

async function generateUsageReport() {
  try {
    console.log('📈 Generando reporte de uso mensual...');
    
    const currentDate = new Date();
    const lastMonth = currentDate.getMonth() === 0 ? 12 : currentDate.getMonth();
    const lastMonthYear = currentDate.getMonth() === 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();

    // Obtener estadísticas agregadas del mes anterior
    const { data: usageStats, error: statsError } = await supabase
      .from('usage_counters')
      .select(`
        org_id,
        chats_used,
        tokens_in,
        tokens_out,
        voice_minutes,
        workspaces!inner(name, plan)
      `)
      .eq('year', lastMonthYear)
      .eq('month', lastMonth);

    if (statsError) {
      throw new Error(`Error fetching usage stats: ${statsError.message}`);
    }

    // Calcular totales
    const totals = usageStats.reduce((acc, stat) => ({
      totalChats: acc.totalChats + stat.chats_used,
      totalTokensIn: acc.totalTokensIn + stat.tokens_in,
      totalTokensOut: acc.totalTokensOut + stat.tokens_out,
      totalVoiceMinutes: acc.totalVoiceMinutes + stat.voice_minutes,
    }), {
      totalChats: 0,
      totalTokensIn: 0,
      totalTokensOut: 0,
      totalVoiceMinutes: 0,
    });

    // Estadísticas por plan
    const planStats = usageStats.reduce((acc, stat) => {
      const plan = stat.workspaces.plan;
      if (!acc[plan]) {
        acc[plan] = { count: 0, chats: 0, tokens: 0, voice: 0 };
      }
      acc[plan].count++;
      acc[plan].chats += stat.chats_used;
      acc[plan].tokens += stat.tokens_in + stat.tokens_out;
      acc[plan].voice += stat.voice_minutes;
      return acc;
    }, {});

    console.log('\n📊 Reporte de uso mensual:');
    console.log(`   Período: ${lastMonthYear}-${lastMonth.toString().padStart(2, '0')}`);
    console.log(`   Total chats: ${totals.totalChats.toLocaleString()}`);
    console.log(`   Total tokens: ${(totals.totalTokensIn + totals.totalTokensOut).toLocaleString()}`);
    console.log(`   Total minutos de voz: ${totals.totalVoiceMinutes.toLocaleString()}`);
    
    console.log('\n📋 Por plan:');
    Object.entries(planStats).forEach(([plan, stats]) => {
      console.log(`   ${plan.toUpperCase()}:`);
      console.log(`     - Organizaciones: ${stats.count}`);
      console.log(`     - Chats: ${stats.chats.toLocaleString()}`);
      console.log(`     - Tokens: ${stats.tokens.toLocaleString()}`);
      console.log(`     - Voz: ${stats.voice.toLocaleString()} min`);
    });

  } catch (error) {
    console.error('❌ Error generando reporte:', error.message);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'reset':
        await resetMonthlyUsageCounters();
        break;
      case 'report':
        await generateUsageReport();
        break;
      case 'both':
        await resetMonthlyUsageCounters();
        await generateUsageReport();
        break;
      default:
        console.log('Uso: node reset-monthly-usage.js [reset|report|both]');
        console.log('  reset  - Resetear contadores mensuales');
        console.log('  report - Generar reporte de uso');
        console.log('  both   - Resetear y generar reporte');
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = {
  resetMonthlyUsageCounters,
  generateUsageReport
};
