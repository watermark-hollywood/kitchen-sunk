var handleDataTableButtons = function () {
    "use strict";

    0 !== $("#datatable-printlabels").length && $("#datatable-printlabels").DataTable({
        dom: "Bfrtip",
        pageLength: "50",
        select: true,
        order: [1, "asc"],
        columnDefs: [
            {"orderable": false, "targets": [0]}
        ],
        buttons: [
            {
                text: 'Select all',
                className: "btn-primary btn-trans waves-effect waves-primary w-md m-b-5",
                action: function () {
                    table.rows().select();
                    $(".checkbox").prop('checked', true);
                }
            },
            {
                text: 'Select none',
                className: "btn-primary btn-trans waves-effect waves-primary w-md m-b-5",
                action: function () {
                    table.rows().deselect();
                    $(".checkbox").prop('checked', false);
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






