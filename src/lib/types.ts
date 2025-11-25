export interface CloudflareStatus {
  status: {
    indicator: 'none' | 'minor' | 'major' | 'critical';
    description: string;
  };
  page: {
    id: string;
    name: string;
    url: string;
    updated_at: string;
  };
}

export type ComponentStatus =
  | 'operational'
  | 'degraded_performance'
  | 'partial_outage'
  | 'major_outage'
  | 'under_maintenance';

export interface Component {
  id: string;
  name: string;
  status: ComponentStatus;
  created_at: string;
  updated_at: string;
  position: number;
  description: string | null;
  showcase: boolean;
  group_id: string | null;
  group: boolean;
  only_show_if_degraded: boolean;
  components?: string[];
}

export interface ComponentsResponse {
  page: {
    id: string;
    name: string;
    url: string;
  };
  components: Component[];
}

export interface IncidentUpdate {
  id: string;
  status: string;
  body: string;
  created_at: string;
  updated_at: string;
  display_at: string;
}

export interface Incident {
  id: string;
  name: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved' | 'postmortem';
  impact: 'none' | 'minor' | 'major' | 'critical';
  created_at: string;
  updated_at: string;
  monitoring_at: string | null;
  resolved_at: string | null;
  shortlink: string;
  incident_updates: IncidentUpdate[];
  components: Component[];
}

export interface IncidentsResponse {
  page: {
    id: string;
    name: string;
    url: string;
  };
  incidents: Incident[];
}

export interface ScheduledMaintenance {
  id: string;
  name: string;
  status: 'scheduled' | 'in_progress' | 'verifying' | 'completed';
  impact: 'none' | 'minor' | 'major' | 'critical';
  created_at: string;
  updated_at: string;
  scheduled_for: string;
  scheduled_until: string;
  components: Component[];
}

export interface MaintenanceResponse {
  page: {
    id: string;
    name: string;
    url: string;
  };
  scheduled_maintenances: ScheduledMaintenance[];
}

export interface SummaryResponse {
  page: {
    id: string;
    name: string;
    url: string;
    updated_at: string;
  };
  status: {
    indicator: 'none' | 'minor' | 'major' | 'critical';
    description: string;
  };
  components: Component[];
  incidents: Incident[];
  scheduled_maintenances: ScheduledMaintenance[];
}
