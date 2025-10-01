import { NextRequest, NextResponse } from 'next/server'
import { emailEngine, createSampleEmailTemplate, createSampleEmailCampaign } from '@/lib/email-engine'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'templates') {
      const templates = emailEngine.getAllTemplates();
      
      // Si no hay templates, crear uno de ejemplo
      if (templates.length === 0) {
        createSampleEmailTemplate();
        return NextResponse.json({ templates: emailEngine.getAllTemplates() });
      }
      
      return NextResponse.json({ templates });
    } else if (type === 'campaigns') {
      const campaigns = emailEngine.getAllCampaigns();
      
      // Si no hay campaigns, crear uno de ejemplo
      if (campaigns.length === 0) {
        createSampleEmailCampaign();
        return NextResponse.json({ campaigns: emailEngine.getAllCampaigns() });
      }
      
      return NextResponse.json({ campaigns });
    }

    // Por defecto, retornar resumen estable
    let templates = emailEngine.getAllTemplates();
    let campaigns = emailEngine.getAllCampaigns();

    if (templates.length === 0) templates = [createSampleEmailTemplate()];
    if (campaigns.length === 0) campaigns = [createSampleEmailCampaign()];

    return NextResponse.json({ 
      summary: {
        templateCount: templates.length,
        campaignCount: campaigns.length,
      },
      emails: {
        templates,
        campaigns,
      },
      templates,
      campaigns,
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    if (type === 'template') {
      const template = emailEngine.createTemplate(data);
      return NextResponse.json({ template }, { status: 201 });
    } else if (type === 'campaign') {
      const campaign = emailEngine.createCampaign(data);
      return NextResponse.json({ campaign }, { status: 201 });
    } else if (type === 'send') {
      const { to, templateId, variables } = data;
      const success = await emailEngine.sendEmail(to, templateId, variables);
      return NextResponse.json({ success }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  } catch (error) {
    console.error('Error in emails POST:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}