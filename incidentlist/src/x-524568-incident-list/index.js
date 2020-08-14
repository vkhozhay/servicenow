import { createCustomElement, actionTypes } from '@servicenow/ui-core';
const { COMPONENT_BOOTSTRAPPED } = actionTypes;
import { createHttpEffect } from '@servicenow/ui-effect-http';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import '@servicenow/now-template-card';
import styles from './styles.scss';

const view = (state, { updateState }) => {
	const { result = 'Loading...' } = state;
	return (
		<div>
			<h2>Incidents</h2>
			<div className="container">
				{
					typeof result === 'string' ? result : result.map(incident => {
						return (
							<div className="card-item">
								<now-template-card-assist tagline={{ "icon": "tree-view-long-outline", "label": "Incident" }} actions={[{ "id": "share", "label": "Copy URL" }, { "id": "close", "label": "Mark Complete" }]} heading={{ "label": incident.short_description }} content={[{ "label": "Number", "value": { "type": "string", "value": incident.number } }, { "label": "State", "value": { "type": "string", "value": incident.state } }, { "label": "Assigned group", "value": { "type": "string", "value": incident.assignment_group.display_value } }, { "label": "Assigned To", "value": { "type": "string", "value": incident.assigned_to.display_value } }]} footerContent={{ "label": "Updated", "value": incident.sys_updated_on }} configAria={{}} contentItemMinWidth="500"></now-template-card-assist>
							</div>
						);
					})
				}
			</div>
		</div>
	);
};

createCustomElement('x-524568-incident-list', {
	actionHandlers: {
		[COMPONENT_BOOTSTRAPPED]: coeffects => {
			const { dispatch } = coeffects;

			dispatch('FETCH_INCIDENTS');

		},
		'FETCH_INCIDENTS': createHttpEffect('api/now/table/incident?sysparm_display_value=true', {
			method: 'GET',
			successActionType: 'FETCH_INCIDENTS_SUCCESS'
		}),
		'FETCH_INCIDENTS_SUCCESS': (coeffects) => {
			const { action, updateState } = coeffects;
			const { result } = action.payload;

			updateState({ result });
		}
	},
	renderer: { type: snabbdom },
	view,
	styles
});
