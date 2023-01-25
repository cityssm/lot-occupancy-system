export function handler(_request, response) {
    response.render('admin-database', {
        headTitle: 'Database Maintenance'
    });
}
export default handler;
