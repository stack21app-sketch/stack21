// Conector GitHub - Para interactuar con repositorios y issues de GitHub

import { ConnectorInstance, ConnectorConfig, ConnectorAction, ConnectorTrigger } from './index';

export const githubConnector: ConnectorInstance & any = {
  config: {
    id: 'github',
    name: 'GitHub',
    slug: 'github',
    description: 'Interactuar con repositorios, issues y pull requests de GitHub',
    category: 'Development',
    logoUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    docsUrl: 'https://docs.github.com/en/rest',
    oauthType: 'oauth2',
    version: '1.0.0',
  },

  actions: [
    {
      key: 'create_issue',
      name: 'Crear Issue',
      description: 'Crear un nuevo issue en un repositorio',
      parameters: [
        {
          key: 'owner',
          name: 'Propietario',
          type: 'string',
          required: true,
          description: 'Propietario del repositorio',
        },
        {
          key: 'repo',
          name: 'Repositorio',
          type: 'string',
          required: true,
          description: 'Nombre del repositorio',
        },
        {
          key: 'title',
          name: 'Título',
          type: 'string',
          required: true,
          description: 'Título del issue',
        },
        {
          key: 'body',
          name: 'Descripción',
          type: 'string',
          required: false,
          description: 'Descripción del issue',
        },
        {
          key: 'labels',
          name: 'Etiquetas',
          type: 'array',
          required: false,
          description: 'Etiquetas del issue',
        },
        {
          key: 'assignees',
          name: 'Asignados',
          type: 'array',
          required: false,
          description: 'Usuarios asignados al issue',
        },
        {
          key: 'milestone',
          name: 'Hito',
          type: 'number',
          required: false,
          description: 'ID del hito',
        },
      ],
      outputSchema: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          number: { type: 'number' },
          title: { type: 'string' },
          body: { type: 'string' },
          state: { type: 'string' },
          labels: { type: 'array' },
          assignees: { type: 'array' },
          milestone: { type: 'object' },
          created_at: { type: 'string' },
          updated_at: { type: 'string' },
        },
      },
    },
    {
      key: 'get_issues',
      name: 'Obtener Issues',
      description: 'Obtener issues de un repositorio',
      parameters: [
        {
          key: 'owner',
          name: 'Propietario',
          type: 'string',
          required: true,
          description: 'Propietario del repositorio',
        },
        {
          key: 'repo',
          name: 'Repositorio',
          type: 'string',
          required: true,
          description: 'Nombre del repositorio',
        },
        {
          key: 'state',
          name: 'Estado',
          type: 'string',
          required: false,
          description: 'Estado de los issues',
          default: 'open',
          options: [
            { label: 'Abiertos', value: 'open' },
            { label: 'Cerrados', value: 'closed' },
            { label: 'Todos', value: 'all' },
          ],
        },
        {
          key: 'labels',
          name: 'Etiquetas',
          type: 'string',
          required: false,
          description: 'Filtrar por etiquetas (separadas por comas)',
        },
        {
          key: 'assignee',
          name: 'Asignado',
          type: 'string',
          required: false,
          description: 'Filtrar por usuario asignado',
        },
        {
          key: 'per_page',
          name: 'Por página',
          type: 'number',
          required: false,
          description: 'Número de issues por página',
          default: 30,
        },
        {
          key: 'page',
          name: 'Página',
          type: 'number',
          required: false,
          description: 'Número de página',
          default: 1,
        },
      ],
      outputSchema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            number: { type: 'number' },
            title: { type: 'string' },
            body: { type: 'string' },
            state: { type: 'string' },
            labels: { type: 'array' },
            assignees: { type: 'array' },
            created_at: { type: 'string' },
            updated_at: { type: 'string' },
          },
        },
      },
    },
    {
      key: 'create_pull_request',
      name: 'Crear Pull Request',
      description: 'Crear un nuevo pull request',
      parameters: [
        {
          key: 'owner',
          name: 'Propietario',
          type: 'string',
          required: true,
          description: 'Propietario del repositorio',
        },
        {
          key: 'repo',
          name: 'Repositorio',
          type: 'string',
          required: true,
          description: 'Nombre del repositorio',
        },
        {
          key: 'title',
          name: 'Título',
          type: 'string',
          required: true,
          description: 'Título del pull request',
        },
        {
          key: 'head',
          name: 'Rama origen',
          type: 'string',
          required: true,
          description: 'Rama de origen del pull request',
        },
        {
          key: 'base',
          name: 'Rama destino',
          type: 'string',
          required: true,
          description: 'Rama de destino del pull request',
        },
        {
          key: 'body',
          name: 'Descripción',
          type: 'string',
          required: false,
          description: 'Descripción del pull request',
        },
        {
          key: 'draft',
          name: 'Borrador',
          type: 'boolean',
          required: false,
          description: 'Si es un borrador',
          default: false,
        },
      ],
      outputSchema: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          number: { type: 'number' },
          title: { type: 'string' },
          body: { type: 'string' },
          state: { type: 'string' },
          draft: { type: 'boolean' },
          head: { type: 'object' },
          base: { type: 'object' },
          created_at: { type: 'string' },
          updated_at: { type: 'string' },
        },
      },
    },
    {
      key: 'get_repositories',
      name: 'Obtener Repositorios',
      description: 'Obtener repositorios del usuario autenticado',
      parameters: [
        {
          key: 'type',
          name: 'Tipo',
          type: 'string',
          required: false,
          description: 'Tipo de repositorios',
          default: 'all',
          options: [
            { label: 'Todos', value: 'all' },
            { label: 'Públicos', value: 'public' },
            { label: 'Privados', value: 'private' },
            { label: 'Forks', value: 'forks' },
            { label: 'Fuentes', value: 'sources' },
          ],
        },
        {
          key: 'sort',
          name: 'Ordenar por',
          type: 'string',
          required: false,
          description: 'Campo por el que ordenar',
          default: 'updated',
          options: [
            { label: 'Actualizado', value: 'updated' },
            { label: 'Creado', value: 'created' },
            { label: 'Pushed', value: 'pushed' },
            { label: 'Nombre', value: 'full_name' },
          ],
        },
        {
          key: 'per_page',
          name: 'Por página',
          type: 'number',
          required: false,
          description: 'Número de repositorios por página',
          default: 30,
        },
        {
          key: 'page',
          name: 'Página',
          type: 'number',
          required: false,
          description: 'Número de página',
          default: 1,
        },
      ],
      outputSchema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            full_name: { type: 'string' },
            description: { type: 'string' },
            private: { type: 'boolean' },
            html_url: { type: 'string' },
            clone_url: { type: 'string' },
            default_branch: { type: 'string' },
            created_at: { type: 'string' },
            updated_at: { type: 'string' },
            pushed_at: { type: 'string' },
          },
        },
      },
    },
  ],

  triggers: [
    {
      key: 'issue_opened',
      name: 'Issue Abierto',
      description: 'Se dispara cuando se abre un nuevo issue',
      type: 'webhook',
      outputSchema: {
        type: 'object',
        properties: {
          action: { type: 'string' },
          issue: { type: 'object' },
          repository: { type: 'object' },
          sender: { type: 'object' },
        },
      },
    },
    {
      key: 'pull_request_opened',
      name: 'Pull Request Abierto',
      description: 'Se dispara cuando se abre un nuevo pull request',
      type: 'webhook',
      outputSchema: {
        type: 'object',
        properties: {
          action: { type: 'string' },
          pull_request: { type: 'object' },
          repository: { type: 'object' },
          sender: { type: 'object' },
        },
      },
    },
    {
      key: 'push',
      name: 'Push',
      description: 'Se dispara cuando se hace push a un repositorio',
      type: 'webhook',
      outputSchema: {
        type: 'object',
        properties: {
          ref: { type: 'string' },
          commits: { type: 'array' },
          repository: { type: 'object' },
          pusher: { type: 'object' },
        },
      },
    },
  ],

  async executeAction(actionKey: string, parameters: any, credentials: any) {
    const { access_token } = credentials;
    
    if (!access_token) {
      throw new Error('Token de acceso de GitHub requerido');
    }

    const baseUrl = 'https://api.github.com';

    switch (actionKey) {
      case 'create_issue':
        return await (githubConnector as any).createIssue(parameters, access_token, baseUrl);
      
      case 'get_issues':
        return await (githubConnector as any).getIssues(parameters, access_token, baseUrl);
      
      case 'create_pull_request':
        return await (githubConnector as any).createPullRequest(parameters, access_token, baseUrl);
      
      case 'get_repositories':
        return await (githubConnector as any).getRepositories(parameters, access_token, baseUrl);
      
      default:
        throw new Error(`Acción no soportada: ${actionKey}`);
    }
  },

  async createIssue(parameters: any, accessToken: string, baseUrl: string) {
    const {
      owner,
      repo,
      title,
      body,
      labels,
      assignees,
      milestone,
    } = parameters;

    const bodyData: any = {
      title,
    };

    if (body) bodyData.body = body;
    if (labels) bodyData.labels = labels;
    if (assignees) bodyData.assignees = assignees;
    if (milestone) bodyData.milestone = milestone;

    const response = await fetch(`${baseUrl}/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error creando issue: ${error}`);
    }

    return await response.json();
  },

  async getIssues(parameters: any, accessToken: string, baseUrl: string) {
    const {
      owner,
      repo,
      state = 'open',
      labels,
      assignee,
      per_page = 30,
      page = 1,
    } = parameters;

    const searchParams = new URLSearchParams({
      state,
      per_page: per_page.toString(),
      page: page.toString(),
    });

    if (labels) searchParams.append('labels', labels);
    if (assignee) searchParams.append('assignee', assignee);

    const response = await fetch(`${baseUrl}/repos/${owner}/${repo}/issues?${searchParams}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error obteniendo issues: ${error}`);
    }

    return await response.json();
  },

  async createPullRequest(parameters: any, accessToken: string, baseUrl: string) {
    const {
      owner,
      repo,
      title,
      head,
      base,
      body,
      draft = false,
    } = parameters;

    const bodyData: any = {
      title,
      head,
      base,
    };

    if (body) bodyData.body = body;
    if (draft) bodyData.draft = draft;

    const response = await fetch(`${baseUrl}/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error creando pull request: ${error}`);
    }

    return await response.json();
  },

  async getRepositories(parameters: any, accessToken: string, baseUrl: string) {
    const {
      type = 'all',
      sort = 'updated',
      per_page = 30,
      page = 1,
    } = parameters;

    const searchParams = new URLSearchParams({
      type,
      sort,
      per_page: per_page.toString(),
      page: page.toString(),
    });

    const response = await fetch(`${baseUrl}/user/repos?${searchParams}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error obteniendo repositorios: ${error}`);
    }

    return await response.json();
  },

  async setupWebhook(config: any, credentials: any) {
    // GitHub webhooks requieren configuración especial
    return 'github_webhook_setup_required';
  },

  async removeWebhook(webhookId: string, credentials: any) {
    return;
  },
};
