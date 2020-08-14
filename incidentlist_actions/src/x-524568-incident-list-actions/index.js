import { createCustomElement, actionTypes } from '@servicenow/ui-core';
const { COMPONENT_BOOTSTRAPPED } = actionTypes;
import { createHttpEffect } from '@servicenow/ui-effect-http';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import '@servicenow/now-template-card';
import '@servicenow/now-loader';
import '@servicenow/now-modal';
import '@servicenow/now-label-value'
import styles from './styles.scss';

const view = (state, { updateState }) => {
	const { result, dataForModal } = state;
	const modal = result.find(inc => dataForModal === inc.sys_id);

	return (
		<div>
			<h2>Incidents</h2>
			<div className="container">
				{
					!result ? <now-loader size="lg"></now-loader> : result.map(incident => {
						return (
							<div className="card-item">
								<now-template-card-assist tagline={{ "icon": "tree-view-long-outline", "label": "Incident" }} actions={[{ "id": "open", "label": "Open Record", "component_id": incident.sys_id }, { "id": "delete", "label": "Delete", "component_id": incident.sys_id }]} heading={{ "label": incident.short_description }} content={[{ "label": "Number", "value": { "type": "string", "value": incident.number } }, { "label": "State", "value": { "type": "string", "value": incident.state } }, { "label": "Assignment group", "value": { "type": "string", "value": incident.assignment_group.display_value } }, { "label": "Assigned To", "value": { "type": "string", "value": incident.assigned_to.display_value } }]} footerContent={{ "label": "Updated", "value": incident.sys_updated_on }} configAria={{}} contentItemMinWidth="500"></now-template-card-assist>
							</div>
						);
					})
				}
				{
					dataForModal ? <now-modal footerActions={[{ "label": "Delete", "id": "delete", "variant": "primary-negative", "component_id": modal.sys_id }]} size="md" opened={true}>
						<div className="modal-content__container">
							<div className="modal-content__item">
								<now-label-value-stacked items={[{ "label": "Number", "value": { "type": "string", "value": modal.number } }]} itemMinWidth="" delimiter="," size="md" align="horizontal-equal"></now-label-value-stacked>
							</div>
							<div className="modal-content__item">
								<now-label-value-stacked items={[{ "label": "State", "value": { "type": "string", "value": modal.state } }]} itemMinWidth="" delimiter="," size="md" align="horizontal-equal"></now-label-value-stacked>
							</div>
							<div className="modal-content__item">
								<now-label-value-stacked items={[{ "label": "Opened At", "value": { "type": "string", "value": modal.opened_at } }]} itemMinWidth="" delimiter="," size="md" align="horizontal-equal"></now-label-value-stacked>
							</div>
							<div className="modal-content__item">
								<now-label-value-stacked items={[{ "label": "Short Description", "value": { "type": "string", "value": modal.short_description } }]} itemMinWidth="" delimiter="," size="md" align="horizontal-equal"></now-label-value-stacked>
							</div>
							<div className="modal-content__item">
								<now-label-value-stacked items={[{ "label": "Assignment Group", "value": { "type": "string", "value": modal.assignment_group } }]} itemMinWidth="" delimiter="," size="md" align="horizontal-equal"></now-label-value-stacked>
							</div>
							<div className="modal-content__item">
								<now-label-value-stacked items={[{ "label": "Assigned To", "value": { "type": "string", "value": modal.assigned_to } }]} itemMinWidth="" delimiter="," size="md" align="horizontal-equal"></now-label-value-stacked>
							</div>
						</div>
					</now-modal> : ''
				}
			</div>
		</div>
	);
};

createCustomElement('x-524568-incident-list-actions', {
	actionHandlers: {
		[COMPONENT_BOOTSTRAPPED]: (coeffects) => {
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
			updateState({ result })
		},
		'NOW_DROPDOWN_PANEL#ITEM_CLICKED': (coeffects) => {
			const { action, updateState, dispatch } = coeffects;
			const { id, component_id } = action.payload.item;
			if (id === 'open') updateState({ dataForModal: component_id });
			else if (id === 'delete') dispatch('FETCH_DELETE_INCEDENT', { sys_id: component_id });
		},
		'FETCH_DELETE_INCEDENT': createHttpEffect('api/now/table/incident/:sys_id', {
			method: 'DELETE',
			pathParams: ['sys_id'],
			successActionType: 'FETCH_INCIDENTS'
		}),
		'NOW_MODAL#FOOTER_ACTION_CLICKED': (coeffects) => {
			const { action, dispatch, updateState } = coeffects;
			const { id, component_id } = action.payload.action;
			updateState({ dataForModal: null });
			if (id === 'delete') dispatch('FETCH_DELETE_INCEDENT', { sys_id: component_id });
		}


	},
	renderer: { type: snabbdom },
	view,
	styles
});
