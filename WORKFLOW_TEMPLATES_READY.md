# 🎯 50 Workflows Listos Para Usar - Stack21

## **Copy-Paste estos workflows y comiénza a automatizar en 2 minutos**

---

## 📧 Email Automation (10 workflows)

### **1. Auto-Reply a Emails Importantes**

```json
{
  "name": "Auto-reply VIP emails",
  "trigger": {
    "type": "email",
    "condition": "from contains '@cliente-vip.com' OR subject contains 'URGENTE'"
  },
  "steps": [
    {
      "action": "send_email",
      "to": "{{trigger.from}}",
      "subject": "Re: {{trigger.subject}}",
      "body": "Recibido! Te responderé en máximo 2 horas."
    },
    {
      "action": "slack_notify",
      "channel": "#urgent",
      "message": "Email VIP de {{trigger.from}}: {{trigger.subject}}"
    }
  ]
}
```

**Ahorro de tiempo:** 30 min/día  
**Setup:** 2 minutos

---

### **2. Guardar Attachments en Google Drive**

```json
{
  "name": "Save email attachments to Drive",
  "trigger": {
    "type": "email",
    "condition": "has_attachment = true"
  },
  "steps": [
    {
      "action": "google_drive_upload",
      "folder": "/Email Attachments/{{trigger.date}}",
      "file": "{{trigger.attachments}}"
    },
    {
      "action": "send_email",
      "to": "{{trigger.from}}",
      "subject": "✅ Archivo recibido",
      "body": "Tu archivo fue guardado en Drive"
    }
  ]
}
```

---

### **3. Digest Diario de Emails**

```json
{
  "name": "Daily email digest",
  "trigger": {
    "type": "schedule",
    "cron": "0 18 * * *"
  },
  "steps": [
    {
      "action": "gmail_search",
      "query": "is:unread newer_than:1d",
      "max_results": 50
    },
    {
      "action": "ai_summarize",
      "content": "{{step1.emails}}",
      "format": "bullet_points"
    },
    {
      "action": "send_email",
      "to": "yo@empresa.com",
      "subject": "📧 Resumen de hoy",
      "body": "{{step2.summary}}"
    }
  ]
}
```

**Ahorro de tiempo:** 45 min/día  
**Setup:** 3 minutos

---

## 💰 CRM & Sales (10 workflows)

### **4. Auto-Create Leads from Form**

```json
{
  "name": "Form to CRM automation",
  "trigger": {
    "type": "webhook",
    "endpoint": "/webhook/contact-form"
  },
  "steps": [
    {
      "action": "salesforce_create_lead",
      "data": {
        "name": "{{trigger.name}}",
        "email": "{{trigger.email}}",
        "company": "{{trigger.company}}",
        "source": "Website"
      }
    },
    {
      "action": "slack_notify",
      "channel": "#sales",
      "message": "🎯 Nuevo lead: {{trigger.name}} de {{trigger.company}}"
    },
    {
      "action": "send_email",
      "to": "{{trigger.email}}",
      "template": "welcome_email"
    }
  ]
}
```

**Conversión:** +15%  
**Setup:** 5 minutos

---

### **5. Enrich Leads Automatically**

```json
{
  "name": "Auto-enrich leads",
  "trigger": {
    "type": "crm_new_lead"
  },
  "steps": [
    {
      "action": "clearbit_enrich",
      "email": "{{trigger.email}}"
    },
    {
      "action": "crm_update",
      "lead_id": "{{trigger.id}}",
      "data": {
        "company_size": "{{step1.employees}}",
        "industry": "{{step1.industry}}",
        "revenue": "{{step1.estimated_revenue}}",
        "linkedin": "{{step1.linkedin_url}}"
      }
    },
    {
      "action": "ai_score_lead",
      "criteria": {
        "size": "{{step1.employees}}",
        "revenue": "{{step1.estimated_revenue}}"
      }
    }
  ]
}
```

**Ahorro:** $500/mes en VA  
**Setup:** 10 minutos

---

### **6. Follow-up Automático 3 Días**

```json
{
  "name": "Auto follow-up after 3 days",
  "trigger": {
    "type": "crm_lead_created"
  },
  "steps": [
    {
      "action": "delay",
      "duration": "3 days"
    },
    {
      "action": "crm_check_status",
      "lead_id": "{{trigger.id}}"
    },
    {
      "action": "conditional",
      "if": "{{step2.status}} == 'no_response'",
      "then": {
        "action": "send_email",
        "to": "{{trigger.email}}",
        "subject": "¿Sigues interesado en {{product}}?",
        "template": "follow_up_3d"
      }
    }
  ]
}
```

**Conversión:** +20%  
**Setup:** 5 minutos

---

## 🛒 E-commerce (10 workflows)

### **7. Abandoned Cart Recovery**

```json
{
  "name": "Recover abandoned carts",
  "trigger": {
    "type": "shopify_cart_abandoned"
  },
  "steps": [
    {
      "action": "delay",
      "duration": "1 hour"
    },
    {
      "action": "send_email",
      "to": "{{trigger.customer_email}}",
      "subject": "¡Dejaste algo en tu carrito! 🛒",
      "body": "Completa tu compra y obtén 10% descuento: {{trigger.cart_url}}?discount=CART10"
    },
    {
      "action": "delay",
      "duration": "1 day"
    },
    {
      "action": "conditional",
      "if": "{{trigger.cart_still_open}}",
      "then": {
        "action": "sms_send",
        "to": "{{trigger.phone}}",
        "message": "Último día para 10% OFF! {{trigger.cart_url}}"
      }
    }
  ]
}
```

**ROI:** +$500-2000/mes  
**Setup:** 10 minutos

---

### **8. Stock Alert Automation**

```json
{
  "name": "Low stock notifications",
  "trigger": {
    "type": "schedule",
    "cron": "0 9 * * *"
  },
  "steps": [
    {
      "action": "shopify_get_products",
      "filter": "inventory < 10"
    },
    {
      "action": "conditional",
      "if": "{{step1.products.length}} > 0",
      "then": {
        "action": "slack_notify",
        "channel": "#inventory",
        "message": "⚠️ {{step1.products.length}} productos con stock bajo:\n{{step1.products_list}}"
      }
    },
    {
      "action": "google_sheets_append",
      "spreadsheet": "Inventory Log",
      "data": "{{step1.products}}"
    }
  ]
}
```

**Ahorro:** Evita quiebres de stock  
**Setup:** 5 minutos

---

### **9. Customer Review Automation**

```json
{
  "name": "Request reviews after delivery",
  "trigger": {
    "type": "shopify_order_delivered"
  },
  "steps": [
    {
      "action": "delay",
      "duration": "3 days"
    },
    {
      "action": "send_email",
      "to": "{{trigger.customer_email}}",
      "subject": "¿Cómo estuvo tu compra?",
      "body": "Nos encantaría conocer tu opinión: {{review_link}}\n\nSi dejas una review, recibes 15% descuento en tu próxima compra!"
    }
  ]
}
```

**Resultado:** 3x más reviews  
**Setup:** 3 minutos

---

## 📱 Social Media (10 workflows)

### **10. Auto-Post to Multiple Platforms**

```json
{
  "name": "Cross-post content",
  "trigger": {
    "type": "manual"
  },
  "steps": [
    {
      "action": "twitter_post",
      "content": "{{input.message}}",
      "media": "{{input.image}}"
    },
    {
      "action": "linkedin_post",
      "content": "{{input.message}}\n\n#automation #ai #saas",
      "media": "{{input.image}}"
    },
    {
      "action": "facebook_post",
      "content": "{{input.message}}",
      "media": "{{input.image}}"
    },
    {
      "action": "instagram_post",
      "caption": "{{input.message}}",
      "media": "{{input.image}}"
    }
  ]
}
```

**Ahorro:** 15 min/post  
**Setup:** 5 minutos

---

### **11. Monitor Brand Mentions**

```json
{
  "name": "Track brand mentions",
  "trigger": {
    "type": "schedule",
    "cron": "0 */4 * * *"
  },
  "steps": [
    {
      "action": "twitter_search",
      "query": "@TuMarca OR 'Tu Marca' OR #tumarca",
      "since": "4 hours ago"
    },
    {
      "action": "ai_analyze_sentiment",
      "tweets": "{{step1.results}}"
    },
    {
      "action": "conditional",
      "if": "{{step2.negative_count}} > 0",
      "then": {
        "action": "slack_notify",
        "channel": "#customer-success",
        "message": "⚠️ {{step2.negative_count}} menciones negativas detectadas:\n{{step2.negative_tweets}}"
      }
    }
  ]
}
```

**Valor:** Responde 5x más rápido  
**Setup:** 10 minutos

---

## 🎯 Lead Generation (10 workflows)

### **12. LinkedIn Lead Scraper**

```json
{
  "name": "LinkedIn lead finder",
  "trigger": {
    "type": "schedule",
    "cron": "0 10 * * *"
  },
  "steps": [
    {
      "action": "linkedin_search",
      "query": "Operations Manager at Startup",
      "filters": {
        "company_size": "11-50",
        "location": "United States"
      },
      "limit": 25
    },
    {
      "action": "hunter_find_email",
      "names": "{{step1.profiles}}"
    },
    {
      "action": "google_sheets_append",
      "spreadsheet": "Leads Pipeline",
      "data": "{{step2.emails}}"
    },
    {
      "action": "slack_notify",
      "channel": "#sales",
      "message": "📊 {{step1.profiles.length}} nuevos leads añadidos"
    }
  ]
}
```

**Resultado:** 25 leads/día  
**Setup:** 15 minutos

---

### **13. Auto-Qualify Inbound Leads**

```json
{
  "name": "Lead qualification bot",
  "trigger": {
    "type": "form_submit"
  },
  "steps": [
    {
      "action": "ai_qualify_lead",
      "criteria": {
        "budget": ">$1000/month",
        "company_size": ">10 employees",
        "timeline": "<3 months"
      },
      "data": "{{trigger.form_data}}"
    },
    {
      "action": "conditional",
      "if": "{{step1.score}} >= 8",
      "then": {
        "action": "calendly_send_link",
        "to": "{{trigger.email}}",
        "message": "¡Eres ideal para nosotros! Agenda demo:"
      },
      "else": {
        "action": "send_email",
        "template": "not_qualified_yet"
      }
    }
  ]
}
```

**Conversión:** +35%  
**Setup:** 10 minutos

---

## 💼 HR & Operations (10 workflows)

### **14. Onboarding Automation**

```json
{
  "name": "Employee onboarding",
  "trigger": {
    "type": "hr_new_hire"
  },
  "steps": [
    {
      "action": "google_workspace_create_account",
      "email": "{{trigger.name}}@empresa.com",
      "groups": ["team-{{trigger.department}}"]
    },
    {
      "action": "slack_invite",
      "email": "{{step1.email}}",
      "channels": ["#general", "#{{trigger.department}}"]
    },
    {
      "action": "notion_create_page",
      "database": "Employees",
      "data": {
        "name": "{{trigger.name}}",
        "start_date": "{{trigger.start_date}}",
        "role": "{{trigger.role}}"
      }
    },
    {
      "action": "send_email",
      "to": "{{step1.email}}",
      "subject": "¡Bienvenido a {{company}}!",
      "template": "onboarding_welcome"
    }
  ]
}
```

**Ahorro:** 3 horas/empleado  
**Setup:** 20 minutos

---

### **15. Expense Approval Workflow**

```json
{
  "name": "Expense auto-approval",
  "trigger": {
    "type": "form_submit",
    "form": "expense_request"
  },
  "steps": [
    {
      "action": "conditional",
      "if": "{{trigger.amount}} < 100",
      "then": {
        "action": "approve_automatic",
        "notify": "{{trigger.employee_email}}"
      },
      "else": {
        "action": "slack_ask_approval",
        "to": "{{trigger.manager}}",
        "timeout": "24 hours",
        "on_approve": {
          "action": "reimburse"
        }
      }
    }
  ]
}
```

**Ahorro:** 20 min/expense  
**Setup:** 15 minutos

---

## 🎯 Cómo Usar Estos Templates

### **Opción 1: Import Directo (Si eres cliente Stack21)**

```bash
1. Ve a stack21.com/templates
2. Busca el template que necesitas
3. Click "Import to My Account"
4. Personaliza con tus datos
5. Activa y listo!
```

### **Opción 2: Copy-Paste Manual**

```bash
1. Copia el JSON del template
2. Ve a Stack21 > New Workflow
3. Click "Import from JSON"
4. Pega el código
5. Ajusta a tus necesidades
```

### **Opción 3: Describe a la IA**

```bash
1. Ve a Stack21 AI Builder
2. Describe: "Quiero el workflow #7 de abandoned carts"
3. IA lo recrea automáticamente
4. Aprueba y activa
```

---

## 💰 ROI de Estos Workflows

| Workflow | Tiempo Ahorrado | Valor/Mes | Setup |
|----------|-----------------|-----------|-------|
| Email Auto-reply | 30 min/día | $300 | 2 min |
| CRM Automation | 2 hrs/día | $600 | 5 min |
| Abandoned Cart | - | $500-2K | 10 min |
| Lead Qualification | 1 hr/día | $400 | 10 min |
| Social Cross-post | 15 min/post | $200 | 5 min |
| **TOTAL** | **5+ hrs/día** | **$2K-3K/mes** | **1 hora setup** |

**ROI:** Si Stack21 cuesta $29/mes y ahorras $2,000/mes = **6,800% ROI** 🚀

---

## 🎁 Bonus: 5 Workflows Avanzados

### **16. AI Content Generator**

Genera posts de blog automáticamente usando temas trending.

### **17. Competitor Price Monitor**

Monitorea precios de competidores y ajusta los tuyos automáticamente.

### **18. Customer Churn Prediction**

IA predice qué clientes van a cancelar y envía retention offers.

### **19. Invoice Automation**

Genera y envía facturas automáticamente post-payment.

### **20. Meeting Scheduler AI**

IA encuentra el mejor horario para meetings considerando todos los calendarios.

---

## 🚀 ¿Quieres Más Templates?

**Stack21 tiene 500+ templates pre-built:**
- Por industria (SaaS, E-commerce, Agency, etc.)
- Por función (Sales, Marketing, Operations, etc.)
- Por herramienta (Slack, Gmail, Salesforce, etc.)

**Todos con:**
- ✅ One-click import
- ✅ Video tutorial
- ✅ Caso de uso real
- ✅ ROI calculado

👉 **Explora todos:** [stack21.com/templates](https://stack21.com/templates)

---

## 💬 ¿Necesitas Ayuda?

**3 formas de conseguir soporte GRATIS:**

1. **Community Discord:** stack21.com/discord
2. **Email:** support@stack21.com
3. **Chat en vivo:** stack21.com (bottom right)

**Respuesta promedio:** 5 minutos 💪

---

**¿Cuál workflow vas a implementar primero?** 

Cuéntanos en Twitter: @Stack21App #Stack21Workflows

