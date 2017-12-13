(function() {
    'use strict';

    angular
        .module('plataformaDocsApp')
        .controller('RateMySuffixController', RateMySuffixController);

    RateMySuffixController.$inject = ['File','Rate', 'ParseLinks', 'AlertService', 'paginationConstants'];

    function RateMySuffixController(File,Rate, ParseLinks, AlertService, paginationConstants) {

        var vm = this;

        vm.rates = [];
        vm.files=[];
        vm.loadPage = loadPage;
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.page = 0;
        vm.links = {
            last: 0
        };
        vm.predicate = 'id';
        vm.reset = reset;
        vm.reverse = true;

        loadAll();

        function loadAll () {
            File.query(function(result) {
                vm.files = result;
                vm.searchQuery = null;
            });
            Rate.query({
                page: vm.page,
                size: vm.itemsPerPage,
                sort: sort()
            }, onSuccess, onError);
            function sort() {
                var result = [vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc')];
                if (vm.predicate !== 'id') {
                    result.push('id');
                }
                return result;
            }

            function onSuccess(data, headers) {
                vm.links = ParseLinks.parse(headers('link'));
                vm.totalItems = headers('X-Total-Count');
                for (var i = 0; i < data.length; i++) {
                    vm.rates.push(data[i]);
                }
                console.log(vm.rates);
            }

            function onError(error) {
                AlertService.error(error.data.message);
            }
        }

        function reset () {
            vm.page = 0;
            vm.rates = [];
            loadAll();
        }

        function loadPage(page) {
            vm.page = page;
            loadAll();
        }
    }
})();
