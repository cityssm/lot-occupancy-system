export default function handler(_request, response) {
    response.render('admin-database', {
        headTitle: 'Database Maintenance'
    });
}
