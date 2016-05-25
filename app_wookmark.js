(function($) {
  var wookmark = new Wookmark('#container', {
      itemWidth: 100,
      outerOffset: 20,
      flexibleWidth: "100%"
  });
  $.getJSON("https://ohtake.github.io/sanrio-wardrobe/" + "kt-kitty.json")
  .done(function(data) {
    var container = $("#container");
    container.empty();
    for (var i=0; i<data.length; i++) {
      var item = data[i];
      console.log(item);
      var li = $("<li></li>", {"data-filter-class": JSON.stringify(item.tags)});
      var image = $("<img>", {src: item.image});
      var desc = $("<p></p>", {text: item.title});
      li.append(image);
      li.append(desc);
      container.append(li);
    }
    imagesLoaded(container, function() {
      wookmark.initItems();
      wookmark.updateFilterClasses();
      wookmark.layout(true);
    });
  })
  .fail(function(err) {
    var container = $("#container");
    container.empty();
    var li = $("<li></li>", {text: err.status + " " + err.statusText});
    container.append(li);
  });

  // Setup filter buttons when jQuery is available
  var $filters = $('#filters li');

  /**
   * When a filter is clicked, toggle it's active state and refresh.
   */
  function onClickFilter(e) {
    var $item = $(e.currentTarget),
        activeFilters = [],
        filterType = $item.data('filter');

    if (filterType === 'all') {
      $filters.removeClass('active');
    } else {
      $item.toggleClass('active');

      // Collect active filter strings
      $filters.filter('.active').each(function() {
        activeFilters.push($(this).data('filter'));
      });
    }

    wookmark.filter(activeFilters, 'and');
  }

  // Capture filter click events.
  $('#filters').on('click.wookmark-filter', 'li', onClickFilter);
})(jQuery);
