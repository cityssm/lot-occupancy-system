import ical, { ICalEventStatus } from 'ical-generator';
import { getWorkOrderMilestones } from '../../database/getWorkOrderMilestones.js';
import * as configFunctions from '../../helpers/functions.config.js';
import { getPrintConfig } from '../../helpers/functions.print.js';
const calendarCompany = 'cityssm.github.io';
const calendarProduct = configFunctions.getProperty('application.applicationName');
const timeStringSplitRegex = /[ :-]/;
function escapeHTML(stringToEscape) {
    return stringToEscape.replaceAll(/[^\d a-z]/gi, (c) => `&#${c.codePointAt(0)};`);
}
function getUrlRoot(request) {
    return ('http://' +
        request.hostname +
        (configFunctions.getProperty('application.httpPort') === 80
            ? ''
            : `:${configFunctions.getProperty('application.httpPort')}`) +
        configFunctions.getProperty('reverseProxy.urlPrefix'));
}
function getWorkOrderUrl(request, milestone) {
    return `${getUrlRoot(request)}/workOrders/${milestone.workOrderId}`;
}
function buildEventSummary(milestone) {
    let summary = (milestone.workOrderMilestoneCompletionDate ? '✔ ' : '') +
        ((milestone.workOrderMilestoneTypeId ?? -1) === -1
            ? milestone.workOrderMilestoneDescription ?? ''
            : milestone.workOrderMilestoneType ?? '').trim();
    let occupantCount = 0;
    for (const lotOccupancy of milestone.workOrderLotOccupancies) {
        for (const occupant of lotOccupancy.lotOccupancyOccupants) {
            occupantCount += 1;
            if (occupantCount === 1) {
                if (summary !== '') {
                    summary += ': ';
                }
                summary +=
                    (occupant.occupantName ?? '') +
                        ' ' +
                        (occupant.occupantFamilyName ?? '');
            }
        }
    }
    if (occupantCount > 1) {
        summary += ` plus ${(occupantCount - 1).toString()}`;
    }
    return summary;
}
function buildEventDescriptionHTML_occupancies(request, milestone) {
    let descriptionHTML = '';
    if (milestone.workOrderLotOccupancies.length > 0) {
        const urlRoot = getUrlRoot(request);
        descriptionHTML = `<h2>
      Related ${escapeHTML(configFunctions.getProperty('aliases.occupancies'))}
      </h2>
      <table border="1">
      <thead><tr>
      <th>${escapeHTML(configFunctions.getProperty('aliases.occupancy'))} Type</th>
      <th>${escapeHTML(configFunctions.getProperty('aliases.lot'))}</th>
      <th>Start Date</th>
      <th>End Date</th>
      <th>${escapeHTML(configFunctions.getProperty('aliases.occupants'))}</th>
      </tr></thead>
      <tbody>`;
        for (const occupancy of milestone.workOrderLotOccupancies) {
            descriptionHTML += `<tr>
          <td>
            <a href="${urlRoot}/lotOccupancies/${occupancy.lotOccupancyId}">
              ${escapeHTML(occupancy.occupancyType)}
            </a>
          </td>
          <td>
            ${occupancy.lotName ? escapeHTML(occupancy.lotName) : '(Not Set)'}
          </td>
          <td>
            ${occupancy.occupancyStartDateString}
          </td>
          <td>
            ${occupancy.occupancyEndDate
                ? occupancy.occupancyEndDateString
                : '(No End Date)'}
          </td>
          <td>`;
            for (const occupant of occupancy.lotOccupancyOccupants) {
                descriptionHTML += `${escapeHTML(occupant.lotOccupantType)}: ${escapeHTML(occupant.occupantName)} ${escapeHTML(occupant.occupantFamilyName)}<br />`;
            }
            descriptionHTML += '</td></tr>';
        }
        descriptionHTML += '</tbody></table>';
    }
    return descriptionHTML;
}
function buildEventDescriptionHTML_lots(request, milestone) {
    let descriptionHTML = '';
    if (milestone.workOrderLots.length > 0) {
        const urlRoot = getUrlRoot(request);
        descriptionHTML += `<h2>
      Related ${escapeHTML(configFunctions.getProperty('aliases.lots'))}
      </h2>
      <table border="1"><thead><tr>
      <th>
        ${escapeHTML(configFunctions.getProperty('aliases.lot'))} Type
      </th>
      <th>
        ${escapeHTML(configFunctions.getProperty('aliases.map'))}
      </th>
      <th>
        ${escapeHTML(configFunctions.getProperty('aliases.lot'))} Type
      </th>
      <th>Status</th>
      </tr></thead>
      <tbody>`;
        for (const lot of milestone.workOrderLots) {
            descriptionHTML += `<tr>
        <td>
          <a href="${urlRoot}/lots/${lot.lotId.toString()}">
            ${escapeHTML(lot.lotName ?? '')}
          </a>
        </td>
        <td>${escapeHTML(lot.mapName ?? '')}</td>
        <td>${escapeHTML(lot.lotType ?? '')}</td>
        <td>${escapeHTML(lot.lotStatus ?? '')}</td>
        </tr>`;
        }
        descriptionHTML += '</tbody></table>';
    }
    return descriptionHTML;
}
function buildEventDescriptionHTML_prints(request, milestone) {
    let descriptionHTML = '';
    const prints = configFunctions.getProperty('settings.workOrders.prints');
    if (prints.length > 0) {
        const urlRoot = getUrlRoot(request);
        descriptionHTML += '<h2>Prints</h2>';
        for (const printName of prints) {
            const printConfig = getPrintConfig(printName);
            if (printConfig) {
                descriptionHTML += `<p>
          ${escapeHTML(printConfig.title)}<br />
          ${urlRoot}/print/${printName}/?workOrderId=${milestone.workOrderId.toString()}
          </p>`;
            }
        }
    }
    return descriptionHTML;
}
function buildEventDescriptionHTML(request, milestone) {
    const workOrderUrl = getWorkOrderUrl(request, milestone);
    let descriptionHTML = `<h1>Milestone Description</h1>
    <p>${escapeHTML(milestone.workOrderMilestoneDescription ?? '')}</p>
    <h2>Work Order #${milestone.workOrderNumber ?? ''}</h2>
    <p>${escapeHTML(milestone.workOrderDescription ?? '')}</p>
    <p>${workOrderUrl}</p>`;
    descriptionHTML += buildEventDescriptionHTML_occupancies(request, milestone);
    descriptionHTML += buildEventDescriptionHTML_lots(request, milestone);
    descriptionHTML += buildEventDescriptionHTML_prints(request, milestone);
    return descriptionHTML;
}
function buildEventCategoryList(milestone) {
    const categories = [];
    if (milestone.workOrderMilestoneTypeId) {
        categories.push(milestone.workOrderMilestoneType, milestone.workOrderType ?? '');
    }
    if (milestone.workOrderMilestoneCompletionDate) {
        categories.push('Completed');
    }
    return categories;
}
function buildEventLocation(milestone) {
    const lotNames = [];
    if (milestone.workOrderLots.length > 0) {
        for (const lot of milestone.workOrderLots) {
            lotNames.push(`${lot.mapName ?? ''}: ${lot.lotName ?? ''}`);
        }
    }
    return lotNames.join(', ');
}
export async function handler(request, response) {
    const urlRoot = getUrlRoot(request);
    const workOrderMilestoneFilters = {
        workOrderTypeIds: request.query.workOrderTypeIds,
        workOrderMilestoneTypeIds: request.query.workOrderMilestoneTypeIds
    };
    if (request.query.workOrderId) {
        workOrderMilestoneFilters.workOrderId = request.query.workOrderId;
        workOrderMilestoneFilters.workOrderMilestoneDateFilter = 'notBlank';
    }
    else {
        workOrderMilestoneFilters.workOrderMilestoneDateFilter = 'recent';
    }
    const workOrderMilestones = await getWorkOrderMilestones(workOrderMilestoneFilters, {
        includeWorkOrders: true,
        orderBy: 'date'
    });
    const calendar = ical({
        name: 'Work Order Milestone Calendar',
        url: `${urlRoot}/workOrders`
    });
    if (request.query.workOrderId && workOrderMilestones.length > 0) {
        calendar.name(`Work Order #${workOrderMilestones[0].workOrderNumber}`);
        calendar.url(`${urlRoot}/workOrders/${workOrderMilestones[0].workOrderId.toString()}`);
    }
    calendar.prodId({
        company: calendarCompany,
        product: calendarProduct
    });
    for (const milestone of workOrderMilestones) {
        const milestoneTimePieces = `${milestone.workOrderMilestoneDateString} ${milestone.workOrderMilestoneTimeString}`.split(timeStringSplitRegex);
        const milestoneDate = new Date(Number.parseInt(milestoneTimePieces[0], 10), Number.parseInt(milestoneTimePieces[1], 10) - 1, Number.parseInt(milestoneTimePieces[2], 10), Number.parseInt(milestoneTimePieces[3], 10), Number.parseInt(milestoneTimePieces[4], 10));
        const milestoneEndDate = new Date(milestoneDate.getTime());
        milestoneEndDate.setHours(milestoneEndDate.getHours() + 1);
        const summary = buildEventSummary(milestone);
        const workOrderUrl = getWorkOrderUrl(request, milestone);
        const eventData = {
            start: milestoneDate,
            created: new Date(milestone.recordCreate_timeMillis),
            stamp: new Date(milestone.recordCreate_timeMillis),
            lastModified: new Date(Math.max(milestone.recordUpdate_timeMillis, milestone.workOrderRecordUpdate_timeMillis)),
            allDay: !milestone.workOrderMilestoneTime,
            summary,
            url: workOrderUrl
        };
        if (!eventData.allDay) {
            eventData.end = milestoneEndDate;
        }
        const calendarEvent = calendar.createEvent(eventData);
        const descriptionHTML = buildEventDescriptionHTML(request, milestone);
        calendarEvent.description({
            plain: workOrderUrl,
            html: descriptionHTML
        });
        if (milestone.workOrderMilestoneCompletionDate) {
            calendarEvent.status(ICalEventStatus.CONFIRMED);
        }
        const categories = buildEventCategoryList(milestone);
        for (const category of categories) {
            calendarEvent.createCategory({
                name: category
            });
        }
        const location = buildEventLocation(milestone);
        calendarEvent.location(location);
        if (milestone.workOrderLotOccupancies.length > 0) {
            let organizerSet = false;
            for (const lotOccupancy of milestone.workOrderLotOccupancies) {
                for (const occupant of lotOccupancy.lotOccupancyOccupants) {
                    if (organizerSet) {
                        calendarEvent.createAttendee({
                            name: `${occupant.occupantName ?? ''} ${occupant.occupantFamilyName ?? ''}`,
                            email: configFunctions.getProperty('settings.workOrders.calendarEmailAddress')
                        });
                    }
                    else {
                        calendarEvent.organizer({
                            name: `${occupant.occupantName ?? ''} ${occupant.occupantFamilyName ?? ''}`,
                            email: configFunctions.getProperty('settings.workOrders.calendarEmailAddress')
                        });
                        organizerSet = true;
                    }
                }
            }
        }
        else {
            calendarEvent.organizer({
                name: milestone.recordCreate_userName,
                email: configFunctions.getProperty('settings.workOrders.calendarEmailAddress')
            });
        }
    }
    calendar.serve(response);
}
export default handler;
