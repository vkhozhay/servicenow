import '@servicenow/now-template-card';
import { createCustomElement } from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import styles from './styles.scss';


const view = (state, { updateState }) => {
	return (
		<div>
			<div className="container">
				<div className="card-item">
					<now-template-card-assist tagline={{ "icon": "tree-view-long-outline", "label": "Incident" }} actions={[{ "id": "share", "label": "Copy URL" }, { "id": "close", "label": "Mark Complete" }]} heading={{ "label": "My PDF docs are all locked from editing" }} content={[{ "label": "Number", "value": { "type": "string", "value": "INC00000038" } }, { "label": "State", "value": { "type": "string", "value": "Closed" } }, { "label": "Assigned group", "value": { "type": "string", "value": "Service Desk" } }, { "label": "Assigned To", "value": { "type": "string", "value": "Luke Wilson" } }]} footerContent={{ "label": "Updated", "value": "2019-01-15 08:41:09" }} configAria={{}} contentItemMinWidth="500"></now-template-card-assist>
				</div>
				<div className="card-item">
					<now-template-card-assist tagline={{ "icon": "tree-view-long-outline", "label": "Incident" }} actions={[{ "id": "share", "label": "Copy URL" }, { "id": "close", "label": "Mark Complete" }]} heading={{ "label": "Hangs when trying to print VISIO document" }} content={[{ "label": "Number", "value": { "type": "string", "value": "INC00000006" } }, { "label": "State", "value": { "type": "string", "value": "Closed" } }, { "label": "Assigned group", "value": { "type": "string", "value": "Software" } }, { "label": "Assigned To", "value": { "type": "string", "value": "Howard Johnson" } }]} footerContent={{ "label": "Updated", "value": "2019-01-15 08:41:09" }} configAria={{}} contentItemMinWidth="500"></now-template-card-assist>
				</div>
				<div className="card-item">
					<now-template-card-assist tagline={{ "icon": "tree-view-long-outline", "label": "Incident" }} actions={[{ "id": "share", "label": "Copy URL" }, { "id": "close", "label": "Mark Complete" }]} heading={{ "label": "Printer in my office is out of toner" }} content={[{ "label": "Number", "value": { "type": "string", "value": "INC00000005" } }, { "label": "State", "value": { "type": "string", "value": "Closed" } }, { "label": "Assigned group", "value": { "type": "string", "value": "Hardware" } }, { "label": "Assigned To", "value": { "type": "string", "value": "ITIL User" } }]} footerContent={{ "label": "Updated", "value": "2019-01-15 08:41:09" }} configAria={{}} contentItemMinWidth="500"></now-template-card-assist>
				</div>
				<div className="card-item">
					<now-template-card-assist tagline={{ "icon": "tree-view-long-outline", "label": "Incident" }} actions={[{ "id": "share", "label": "Copy URL" }, { "id": "close", "label": "Mark Complete" }]} heading={{ "label": "Can`t read email" }} content={[{ "label": "Number", "value": { "type": "string", "value": "INC00000001" } }, { "label": "State", "value": { "type": "string", "value": "Closed" } }, { "label": "Assigned group", "value": { "type": "string", "value": "Service Desk" } }, { "label": "Assigned To", "value": { "type": "string", "value": "Charlie Whitherspoon" } }]} footerContent={{ "label": "Updated", "value": "2019-01-15 08:41:09" }} configAria={{}} contentItemMinWidth="500"></now-template-card-assist>
				</div>
			</div>
		</div>
	);
};

createCustomElement('x-524568-card-list', {
	renderer: { type: snabbdom },
	view,
	styles
});
