var next = null;
var prev = null;
var page = 1
var page_size =  25;
var qs,all_data,page_url,search,option;
var template
var base = "http://test.cybercommons.org/data/dokarrs/";
$(document).ready( function() {
    var source = $('#detail-template').html();
    template = Handlebars.compile(source);
    $("#dialog-detail").dialog({
        autoOpen: false,
        //height: 750,
        width: 750,
       // position: [340, 250],
        title: "Detail View",
        close: function () {
            //$("#bibAll" + ref_no).remove();
        }
    });
    
    //Get data from  Datalayer
    function getData(url) { 
        $.getJSON( url, function(data) {
            all_data = data;
            set_count(data);
            next= data.next;
            prev = data.previous;
            $('#resulttable tbody').empty();
            var header ='<tr><th>Obs. Number</th><th>Genus</th><th>Species</th><th>Common Name</th><th>County</th><th>Year</th><th>Observer</th></tr>';
            $('#resulttable > tbody:last').append(header);
            $.each(data.results, function(i, item) {
                console.log(item['url']);
                url_detail =item['url'];
                var escaped = "showDetail('" + item['obsnum'] + "');return false;"
                var newtr = '<tr><td><a href="#" onclick="' + escaped +  '">' + item['obsnum']  + '</a></td><td>' 
                newtr = newtr + item['genus'] + '</td><td>' + item['species'] + '</td><td>' + item['common_name'] 
                newtr = newtr + '</td><td>' + item['county'] + '</td><td>' + item['year'] +'</td><td>' + item['obsvr'] + '</td></tr>'
                $('#resulttable > tbody:last').append(newtr);
            });
        });
    }
    function set_count(data){
        if(data.count <= page_size){
            $('#count').text('Record 1 - ' + data.count +  ' Total ' + data.count )
        }else{
            var rec_start =page_size*page - page_size +1;
            var rec_end;
            if(page_size*page >= data.count){
                rec_end = data.count
            }else{
                rec_end = page_size*page
            }   
            $('#count').text('Records ' + rec_start + ' - ' + rec_end  +  ' Total ' + data.count )
        }
        //set csv download of data
        var dload_option ='&page_size=' + data.count
        var download_url = base + '?search=' + search + dload_option +'&format=csv'
        download_url = download_url.replace(' ','%20');
        $('#download').html('<a href="' + download_url + '">Download Result Dataset</a>')
        //console.log(download_url);
    }
    //Set url for data retrieval
    function set_url(type){
        if (type !== 'page'){
            option=''
            search = $('#search').val()
        }else{
            option = '&page=' + qs.page;
        }
        //dload_option ='&page_size=' + data.count
        //var download_url = base + '?search=' + search + dload_option +'&format=csv'
        var url = base + '?search=' + search + option +'&format=jsonp&callback=?' //+ '&callback=?&format=jsonp'
        return url
    }
    //Parse url parameters
    jQuery.extend({
        parseQuerystring: function() {
            var nvpair = {};
            qs = page_url.replace('?', '');
            var pairs = qs.split('&');
            $.each(pairs, function(i, v) {
                var pair = v.split('=');
                nvpair[pair[0]] = pair[1];
            });
            return nvpair;
        }
    });
    //Submit click to get Data
    $('#button').click(function(){
        $('#resulttable').show();
        qs= null;
        page=1;
        getData(set_url('reset'));
        $('#navigate').show();
    });
    //Function for just hit enter instead of submit button push
    $("#search").keyup(function(event){
        if(event.keyCode == 13){
            $("#button").click();
        }
    });
    //Execute next and previous click
    $('#prevlink').click(function(){
        if (prev !== null){
            page_url = prev;
            qs = $.parseQuerystring();
            page = parseInt(qs.page);
            getData(set_url('page'));
        }
        
    });
    $('#nextlink').click(function(){
        if (next !== null){
            page_url=next
            qs = $.parseQuerystring();
            page = parseInt(qs.page);
            getData(set_url('page'));
        }
      });
    //set focus on initial load
    $('#search').focus();
    $('#resulttable').hide();
    $('#navigate').hide();

});
function showDetail(obsnum){
        $.each(all_data.results, function(i, item) {
           if (item['obsnum'] == obsnum){
            $('#dialog-detail').dialog('option', 'title',item['common_name']);
            $("#dialog-detail").dialog('open');
            $("#dialog-detail").html(template(item)) //JSON.stringify(item,undefined,2))
            
            //console.log(item);
           }
        });
        //$.getJSON( url, function(data) {
        //    console.log(data);
        //});

}
