;$(function () {
    let init = function () {
        initBuyBtn();
        $('#addToCart').click(addProductToCart);
        $('#addProductPopup .count').change(calculateCost);
        $('#loadMore').click(loadMoreProducts);
        initSearchForm();
        $('#goSearch').click(goSearch);
        $('.remove-product').click(removeProductFromCart);
    };

    let showAddProductPopup = function () {
        let idProduct = $(this).attr('data-id-product');
        let product = $('#product' + idProduct);
        $('#addProductPopup').attr('data-id-product', idProduct);
        $('#addProductPopup .product-image').attr('src', product.find('.thumbnail img').attr('src'));
        $('#addProductPopup .name').text(product.find('.name').text());
        let price = product.find('.price').text();
        $('#addProductPopup .price').text(price);
        $('#addProductPopup .category').text(product.find('.category').text());
        $('#addProductPopup .producer').text(product.find('.producer').text());
        $('#addProductPopup .count').val(1);
        $('#addProductPopup .cost').text(price);
        $('#addToCart').removeClass('hidden');
        $('#addToCartIndicator').addClass('hidden');
        $('#addProductPopup').modal({
            show: true
        });
    };
    let initBuyBtn = function () {
        $('.buy-btn').click(showAddProductPopup);
    };
    let addProductToCart = function () {
        let idProduct = $('#addProductPopup').attr('data-id-product');
        let count = $('#addProductPopup .count').val();
        $('#addToCart').addClass('hidden');
        $('#addToCartIndicator').removeClass('hidden');
        setTimeout(function () {
            let data = {
                totalCount: count,
                totalCost: 2000
            };
            $('#currentShoppingCart .total-count').text(data.totalCount);
            $('#currentShoppingCart .total-cost').text(data.totalCost);
            $('#currentShoppingCart').removeClass('hidden');
            $('#addProductPopup').modal('hide');
        }, 800);
    };
    let calculateCost = function () {
        let priceStr = $('#addProductPopup .price').text();
        let price = parseFloat(priceStr.replace('$', ' '));
        let count = parseInt($('#addProductPopup .count').val());
        let min = parseInt($('#addProductPopup .count').attr('min'));
        let max = parseInt($('#addProductPopup .count').attr('max'));
        if (count >= min && count <= max) {
            let cost = price * count;
            $('#addProductPopup .cost').text('$ ' + cost);
        } else {
            $('#addProductPopup .count').val(1);
            $('#addProductPopup .cost').text(priceStr);
        }
    };
    let loadMoreProducts = function () {
        $('#loadMore').addClass('hidden');
        $('#loadMoreIndicator').removeClass('hidden');
        setTimeout(function () {
            $('#loadMoreIndicator').addClass('hidden');
            $('#loadMore').removeClass('hidden');
        }, 800);
    };
    let initSearchForm = function () {
        $('#allCategories').click(function () {
            $('.categories .search-option').prop('checked', $(this).is(':checked'));
        });
        $('.categories .search-option').click(function () {
            $('#allCategories').prop('checked', false);
        });
        $('#allProducers').click(function () {
            $('.producers .search-option').prop('checked', $(this).is(':checked'));
        });
        $('.producers .search-option').click(function () {
            $('#allProducers').prop('checked', false);
        });
    };
    let goSearch = function () {
        let isAllSelected = function (selector) {
            let unchecked = 0;
            $(selector).each(function (index, value) {
                if (!$(value).is(':checked')) {
                    unchecked++;
                }
            });
            return unchecked === 0;
        };
        if (isAllSelected('.categories .search-option')) {
            $('.categories .search-option').prop('checked', false);
        }
        if (isAllSelected('.producers .search-option')) {
            $('.producers .search-option').prop('checked', false);
        }
        $('form.search').submit();
    };
    let confirm = function (msg, okFunction) {
        if (window.confirm(msg)) {
            okFunction();
        }
    };
    let removeProductFromCart = function () {
        let btn = $(this);
        confirm('Are you sure?', function () {
            executeRemoveProduct(btn);
        });
    };
    let refreshTotalCost = function () {
        let total = 0;
        $('#shoppingCart .item').each(function (index, value) {
            let count = parseInt($(value).find('.count').text());
            let price = parseFloat($(value).find('.price').text().replace('$', ' '));
            let val = price * count;
            total = total + val;
        });
        $('#shoppingCart .total').text('$' + total);
    };
    let executeRemoveProduct = function (btn) {
        let idProduct = btn.attr('data-id-product');
        let count = btn.attr('data-count');
        btn.removeClass('btn-danger');
        btn.removeClass('btn');
        btn.addClass('load-indicator');
        let text = btn.text();
        btn.text('');
        btn.off('click');

        setTimeout(function () {
            let data = {
                totalCount: 1,
                totalCost: 1
            };
            if (data.totalCount === 0) {
                window.location.href = 'products.html';
            } else {
                let prevCount = parseInt($('#product' + idProduct + ' .count').text());
                let remCount = parseInt(count);
                if (remCount === prevCount) {
                    $('#product' + idProduct).remove();

                    //
                    if ($('#shoppingCart .item').length === 0) {
                        window.location.href = 'products.html';
                    }
                    //
                } else {
                    btn.removeClass('load-indicator');
                    btn.addClass('btn-danger');
                    btn.addClass('btn');
                    btn.text(text);
                    btn.click(removeProductFromCart);
                    $('#product' + idProduct + ' .count').text(prevCount - remCount);
                    if (prevCount - remCount == 1) {
                        $('#product' + idProduct + ' a.remove-product.all').remove();
                    }
                }
                refreshTotalCost();
            }
        }, 1000);
    };

    init();
});