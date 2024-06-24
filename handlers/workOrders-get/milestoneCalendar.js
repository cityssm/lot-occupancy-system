export default function handler(request, response) {
    response.render('workOrder-milestoneCalendar', {
        headTitle: 'Work Order Milestone Calendar'
    });
}
