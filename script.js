// Cloudflare Status Dashboard
const API_BASE = 'https://www.cloudflarestatus.com/api/v2';
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Status label mapping
const statusLabels = {
    operational: 'Operational',
    degraded_performance: 'Degraded',
    partial_outage: 'Partial Outage',
    major_outage: 'Major Outage',
    investigating: 'Investigating',
    identified: 'Identified',
    monitoring: 'Monitoring',
    resolved: 'Resolved',
    scheduled: 'Scheduled',
    in_progress: 'In Progress',
    verifying: 'Verifying',
    completed: 'Completed'
};

// Format date/time
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Update last updated timestamp
function updateTimestamp() {
    const now = new Date();
    document.getElementById('last-updated').textContent = now.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Fetch data from API
async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch ${endpoint}:`, error);
        return null;
    }
}

// Render overall status
function renderOverallStatus(status) {
    const indicator = status?.status?.indicator || 'none';
    const description = status?.status?.description || 'Unknown';

    const statusIcon = document.getElementById('status-icon');
    const statusText = document.getElementById('status-text');
    const statusDot = document.getElementById('status-indicator');

    statusIcon.className = 'status-icon ' + (indicator === 'none' ? 'operational' : indicator);
    statusText.textContent = description;

    // Update header dot
    if (indicator === 'none') {
        statusDot.className = 'status-dot operational';
    } else if (indicator === 'minor') {
        statusDot.className = 'status-dot degraded';
    } else {
        statusDot.className = 'status-dot outage';
    }
}

// Render components
function renderComponents(data) {
    const grid = document.getElementById('components-grid');
    const countEl = document.getElementById('component-count');

    if (!data?.components?.length) {
        grid.innerHTML = '<div class="no-items"><div class="icon">📦</div>No components available</div>';
        return;
    }

    // Filter out component groups (only show actual components)
    const components = data.components.filter(c => !c.group);

    countEl.textContent = `${components.length} total`;

    grid.innerHTML = components.map(component => `
        <div class="component-item">
            <span class="component-name">${component.name}</span>
            <span class="component-status ${component.status}">
                ${statusLabels[component.status] || component.status}
            </span>
        </div>
    `).join('');
}

// Render incidents
function renderIncidents(data) {
    const list = document.getElementById('incidents-list');
    const countEl = document.getElementById('incident-count');

    // Filter for unresolved incidents
    const incidents = data?.incidents?.filter(i =>
        ['investigating', 'identified', 'monitoring'].includes(i.status)
    ) || [];

    countEl.textContent = incidents.length ? `${incidents.length} active` : 'None';

    if (!incidents.length) {
        list.innerHTML = `
            <div class="no-items">
                <div class="icon">✅</div>
                No active incidents
            </div>
        `;
        return;
    }

    list.innerHTML = incidents.map(incident => {
        const latestUpdate = incident.incident_updates?.[0];
        const affectedComponents = incident.components || [];

        return `
            <div class="incident-item">
                <div class="incident-header">
                    <span class="incident-title">${incident.name}</span>
                    <span class="incident-status ${incident.status}">
                        ${statusLabels[incident.status] || incident.status}
                    </span>
                </div>
                ${latestUpdate ? `
                    <div class="incident-update">${latestUpdate.body}</div>
                ` : ''}
                <div class="incident-time">Started: ${formatTime(incident.created_at)}</div>
                ${affectedComponents.length ? `
                    <div class="affected-components">
                        ${affectedComponents.map(c => `<span class="affected-component">${c.name}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// Render scheduled maintenance
function renderMaintenance(data) {
    const list = document.getElementById('maintenance-list');
    const countEl = document.getElementById('maintenance-count');

    // Filter for upcoming/active maintenance
    const maintenances = data?.scheduled_maintenances?.filter(m =>
        ['scheduled', 'in_progress', 'verifying'].includes(m.status)
    ) || [];

    countEl.textContent = maintenances.length ? `${maintenances.length} scheduled` : 'None';

    if (!maintenances.length) {
        list.innerHTML = `
            <div class="no-items">
                <div class="icon">🔧</div>
                No scheduled maintenance
            </div>
        `;
        return;
    }

    list.innerHTML = maintenances.map(maintenance => {
        const affectedComponents = maintenance.components || [];

        return `
            <div class="maintenance-item">
                <div class="maintenance-header">
                    <span class="maintenance-title">${maintenance.name}</span>
                    <span class="maintenance-status ${maintenance.status}">
                        ${statusLabels[maintenance.status] || maintenance.status}
                    </span>
                </div>
                <div class="maintenance-time">
                    Scheduled: ${formatTime(maintenance.scheduled_for)} - ${formatTime(maintenance.scheduled_until)}
                </div>
                ${affectedComponents.length ? `
                    <div class="affected-components">
                        ${affectedComponents.map(c => `<span class="affected-component">${c.name}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

// Fetch all data and render
async function refreshDashboard() {
    console.log('Refreshing dashboard...');

    // Fetch all data in parallel
    const [status, components, incidents, maintenance] = await Promise.all([
        fetchData('/status.json'),
        fetchData('/components.json'),
        fetchData('/incidents.json'),
        fetchData('/scheduled-maintenances.json')
    ]);

    // Render all sections
    renderOverallStatus(status);
    renderComponents(components);
    renderIncidents(incidents);
    renderMaintenance(maintenance);

    // Update timestamp
    updateTimestamp();

    console.log('Dashboard refreshed');
}

// Manual refresh with button animation
async function manualRefresh() {
    const btn = document.getElementById('refresh-btn');
    btn.classList.add('spinning');
    btn.disabled = true;

    await refreshDashboard();

    btn.classList.remove('spinning');
    btn.disabled = false;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initial load
    refreshDashboard();

    // Set up auto-refresh every 5 minutes
    setInterval(refreshDashboard, REFRESH_INTERVAL);

    // Manual refresh button
    document.getElementById('refresh-btn').addEventListener('click', manualRefresh);
});
