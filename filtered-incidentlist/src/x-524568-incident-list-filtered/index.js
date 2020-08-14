import { createCustomElement, actionTypes } from '@servicenow/ui-core';
const { COMPONENT_BOOTSTRAPPED } = actionTypes;
import { createHttpEffect } from '@servicenow/ui-effect-http';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import '@servicenow/now-template-card';
import '@servicenow/now-loader';
import '@servicenow/now-modal';
import '@servicenow/now-label-value';
import styles from './styles.scss';

const view = (state, { updateState }) => {
	let { incidentsArr, dataForModal, filterParams } = state;
	let modal;
	if (dataForModal) modal = incidentsArr.find(inc => dataForModal === inc.sys_id);

	function createFilterParamsArr(dataArr, param, groupName) {
		let result = new Set(dataArr.map(el => eval('el.' + param)));
		result = Array.from(result);
		result = result.filter(el => el);
		result = result.map(el => {
			return {
				"id": el.toLowerCase().replace(' ', '_'),
				"label": el,
				"group": groupName
			}
		})
		return result;
	}

	let incidentStates, incidentAssignmentGroup, incidentAssignedTo;
	if (incidentsArr) {
		incidentStates = createFilterParamsArr(incidentsArr, "state", "state");
		incidentAssignmentGroup = createFilterParamsArr(incidentsArr, "assignment_group.display_value", "assignment_group");
		incidentAssignedTo = createFilterParamsArr(incidentsArr, "assigned_to.display_value", "assigned_to");
	}





	if (filterParams.byState) {
		incidentsArr = incidentsArr.filter(inc => inc.inc.state === filterParams.byState);
	}
	if (filterParams.byAssignmentGroup) {
		incidentsArr = incidentsArr.filter(inc => inc.assignment_group.display_value === filterParams.byAssignmentGroup);
	}
	if (filterParams.byAssignedTo) {
		incidentsArr = incidentsArr.filter(inc => inc.assigned_to.display_value == filterParams.byAssignedTo);
	}



	return (
		<div>
			<h2>Incidents</h2>
			<div className="filter-bar">
				<h5>Filter By:</h5>
				<div className="filter-item">
					<div className="filter-item__label">state</div>
					<now-dropdown items={[{ "id": "null", "label": "", "group": "state" }, ...incidentStates]} selectedItems={["null"]} icon="" placeholder="" tooltipContent="" size="md" variant="secondary" select="single" panelFitProps={{}} configAria={{}}></now-dropdown>
				</div>
				<div className="filter-item">
					<div className="filter-item__label">assignment group</div>
					<now-dropdown items={[{ "id": "null", "label": "", "group": "assignment_group" }, ...incidentAssignmentGroup]} selectedItems={["null"]} icon="" placeholder="" tooltipContent="" size="md" variant="secondary" select="single" panelFitProps={{}} configAria={{}}></now-dropdown>
				</div>
				<div className="filter-item">
					<div className="filter-item__label">assigned to</div>
					<now-dropdown items={[{ "id": "null", "label": "", "group": "assigned_to" }, ...incidentAssignedTo]} selectedItems={["null"]} icon="" placeholder="" tooltipContent="" size="md" variant="secondary" select="single" panelFitProps={{}} configAria={{}}></now-dropdown>
				</div>
			</div>
			<div className="container">
				{
					!incidentsArr ? <now-loader size="lg"></now-loader> : incidentsArr.map(incident => {
						return (
							<div className="card-item">
								<now-template-card-assist tagline={{ "icon": "tree-view-long-outline", "label": "Incident" }} actions={[{ "id": "open", "label": "Open Record", "component_id": incident.sys_id }, { "id": "delete", "label": "Delete", "component_id": incident.sys_id }]} heading={{ "label": incident.short_description }} content={[{ "label": "Number", "value": { "type": "string", "value": incident.number } }, { "label": "State", "value": { "type": "string", "value": incident.state } }, { "label": "Assignment group", "value": { "type": "string", "value": incident.assignment_group.display_value } }, { "label": "Assigned To", "value": { "type": "string", "value": incident.assigned_to.display_value } }]} footerContent={{ "label": "Updated", "value": incident.sys_updated_on }} configAria={{}} contentItemMinWidth="500"></now-template-card-assist>
							</div>
						);
					})
				}
			</div>
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
	);
};

createCustomElement('x-524568-incident-list-filtered', {
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
			updateState({ incidentsArr: result })
		},
		'NOW_DROPDOWN_PANEL#ITEM_CLICKED': (coeffects) => {
			const { action, updateState, dispatch } = coeffects;
			const { id, component_id, label, group } = action.payload.item;
			if (id === 'open') updateState({ dataForModal: component_id });
			else if (id === 'delete') dispatch('FETCH_DELETE_INCEDENT', { sys_id: component_id });
			else if (group === 'state') {
				updateState({
					path: 'filterParams',
					value: { byState: label },
					operation: 'set'
				})
			} else if (group === 'assignment_group') {
				updateState({
					path: 'filterParams',
					value: { byAssignmentGroup: label },
					operation: 'set'
				})
			} else if (group === 'assigned_to') {
				updateState({
					path: 'filterParams',
					value: { byAssignedTo: label },
					operation: 'set'
				})
			}
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
	initialState: {
		incidentsArr: [],
		dataForModal: null,
		filterParams: {
			byState: false,
			byAssignmentGroup: false,
			byAssignedTo: false
		}
	},
	styles
});
