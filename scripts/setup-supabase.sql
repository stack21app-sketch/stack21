-- Script para configurar la base de datos en Supabase
-- Ejecutar en el SQL Editor de Supabase

-- Habilitar Row Level Security (RLS) para multi-tenancy
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE run_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla users
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid()::text = id);

-- Políticas para la tabla workspaces
CREATE POLICY "Users can view workspaces they belong to" ON workspaces
  FOR SELECT USING (
    id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()::text
    )
  );

CREATE POLICY "Workspace members can update workspace" ON workspaces
  FOR UPDATE USING (
    id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()::text AND role IN ('OWNER', 'ADMIN')
    )
  );

-- Políticas para la tabla workspace_members
CREATE POLICY "Users can view workspace members of their workspaces" ON workspace_members
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()::text
    )
  );

-- Políticas para la tabla projects
CREATE POLICY "Users can view projects from their workspaces" ON projects
  FOR SELECT USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()::text
    )
  );

CREATE POLICY "Workspace members can manage projects" ON projects
  FOR ALL USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()::text AND role IN ('OWNER', 'ADMIN', 'MEMBER')
    )
  );

-- Políticas para la tabla modules
CREATE POLICY "Users can view modules from their workspace projects" ON modules
  FOR SELECT USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN workspace_members wm ON p.workspace_id = wm.workspace_id
      WHERE wm.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Workspace members can manage modules" ON modules
  FOR ALL USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN workspace_members wm ON p.workspace_id = wm.workspace_id
      WHERE wm.user_id = auth.uid()::text AND wm.role IN ('OWNER', 'ADMIN', 'MEMBER')
    )
  );

-- Políticas para la tabla workflows
CREATE POLICY "Users can view workflows from their workspace modules" ON workflows
  FOR SELECT USING (
    module_id IN (
      SELECT m.id FROM modules m
      JOIN projects p ON m.project_id = p.id
      JOIN workspace_members wm ON p.workspace_id = wm.workspace_id
      WHERE wm.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Workspace members can manage workflows" ON workflows
  FOR ALL USING (
    module_id IN (
      SELECT m.id FROM modules m
      JOIN projects p ON m.project_id = p.id
      JOIN workspace_members wm ON p.workspace_id = wm.workspace_id
      WHERE wm.user_id = auth.uid()::text AND wm.role IN ('OWNER', 'ADMIN', 'MEMBER')
    )
  );

-- Políticas para la tabla run_logs
CREATE POLICY "Users can view run logs from their workspace workflows" ON run_logs
  FOR SELECT USING (
    workflow_id IN (
      SELECT w.id FROM workflows w
      JOIN modules m ON w.module_id = m.id
      JOIN projects p ON m.project_id = p.id
      JOIN workspace_members wm ON p.workspace_id = wm.workspace_id
      WHERE wm.user_id = auth.uid()::text
    )
  );

-- Función para crear un workspace automáticamente cuando se crea un usuario
CREATE OR REPLACE FUNCTION create_user_workspace()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO workspaces (id, name, slug, creator_id)
  VALUES (
    NEW.id || '_workspace',
    COALESCE(NEW.name, 'Mi Workspace'),
    LOWER(COALESCE(NEW.name, 'mi-workspace')),
    NEW.id
  );
  
  INSERT INTO workspace_members (workspace_id, user_id, role)
  VALUES (
    NEW.id || '_workspace',
    NEW.id,
    'OWNER'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para crear workspace automáticamente
CREATE TRIGGER create_user_workspace_trigger
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_workspace();
