var handleDataTableButtons = function () {
    "use strict";

    0 !== $("#datatable-printlabels").length && $("#datatable-printlabels").DataTable({
        dom: "Bfrtip",
        pageLength: "50",
        select: true,
        buttons: [
            {
                text: 'Select all',
                className: "btn-primary btn-trans waves-effect waves-primary w-md m-b-5",
                action: function () {
                    table.rows().select();
                }
            },
            {
                text: 'Select none',
                className: "btn-primary btn-trans waves-effect waves-primary w-md m-b-5",
                action: function () {
                    table.rows().deselect();
                }
            }
        ],

        responsive: !0
    })
}, TableManageButtons = function () {
    "use strict";
    return {
        init: function () {            
            handleDataTableButtons()
        }
    }
}();






