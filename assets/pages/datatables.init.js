var handleDataTableButtons = function () {
    "use strict";
    0 !== $("#datatable-buttons").length && $("#datatable-buttons").DataTable({
        dom: "Bfrtip",
        pageLength: "50",
        buttons:    [
                        {extend: "copy",    className: "btn-primary btn-trans waves-effect waves-primary w-md m-b-5"}, 
                        {extend: "csv",     className: "btn-primary btn-trans waves-effect waves-primary w-md m-b-5"}, 
                        {extend: "excel",   className: "btn-primary btn-trans waves-effect waves-primary w-md m-b-5"}, 
                        {extend: "pdf",     className: "btn-primary btn-trans waves-effect waves-primary w-md m-b-5"}, 
                        {extend: "print",   className: "btn-primary btn-trans waves-effect waves-primary w-md m-b-5"}
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