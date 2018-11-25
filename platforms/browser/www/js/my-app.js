var myApp = new Framework7();
var $$ = Dom7;
var mainView = myApp.addView('.view-main', { dynamicNavbar: true });

//$$(document).on('deviceready', function() { });
//myApp.onPageInit('about', function (page) { })

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

$('#play').click(function() {
  var player = document.getElementsByTagName('audio')[0];
  if (player.src != '') {
    $('#play').toggle();
    $('#pause').toggle();
    player.play();
  }
})

$('#pause').click(function() {
  $('#play').toggle();
  $('#pause').toggle();
  var player = document.getElementsByTagName('audio')[0];
  player.pause();
})

function divGenerator(d, r='_') {

  var keys = Object.keys(d);

  for (var i = 0; i < keys.length; i++) {

    if (d[keys[i]]['file']) {

      var c = '_';
      var p = d[keys[i]]['dir'].split('\/');

      for (var j = 2; j < p.length; j++) {
        c += p[j].split('_')[0] + '_';
      }

      var cc = '';
      switch (c.split('_')[1]) {
        case "1": cc = 'blue'; break;
        case "2": cc = 'yellow'; break;
        case "3": cc = 'red'; break;
        case "4": cc = 'green'; break;
        case "5": cc = 'pink'; break;
      }

      if (d[keys[i]]['name'].split('_').length > 1) {
        $('#'+c).append('<a onclick="playFile(\'' + d[keys[i]]['dir'] + '/' + d[keys[i]]['name'] + '\')" class="file ' + c + ' ' + cc + '">' + d[keys[i]]['name'].split('_')[1] + '</a>');
      } else {
        $('#'+c).append('<a onclick="playFile(\'' + d[keys[i]]['dir'] + '/' + d[keys[i]]['name'] + '\')" class="file ' + c + ' ' + cc + '">' + d[keys[i]]['name'] + '</a>');
      }

    } else {

      var c = '_';
      var p = d[keys[i]]['dir'].split('\/');
      if (p[2].split('_')[0] == 'x') {
        continue;
      }

      for (var j = 2; j < p.length; j++) {
        c += p[j].split('_')[0] + '_';
      }

      var cc = '';
      var img = '';
      switch (c.split('_')[1]) {
        case "1": cc = 'blue'; break;
        case "2": cc = 'yellow'; break;
        case "3": cc = 'red'; break;
        case "4": cc = 'green'; break;
        case "5": cc = 'pink'; break;
      }

      $('#'+r).append('<a onclick="javascript:showDir(\'' + c + '\')" class="dir ' + c + ' ' + cc + '"><img src="res/' + cc + '.png"/>' + d[keys[i]]['title'].split('_')[1] + '</a>');

      $('#cb').append('<div class="menu" id="' + c + '"><a onclick="showDir(\'' + r + '\')" class="bb"><i class="material-icons">chevron_left</i></a></div>');

      divGenerator( d[keys[i]]['cnt'], c );

    }

  }

}

function showDir(i) {

  $('#cb > div').hide();
  $('#'+i).show();

}

function playFile(p) {

  var player = document.getElementsByTagName('audio')[0];
  player.src = 'http://app.fifi.dk/' + p + '.mp3';
  player.load();
  window.setTimeout(function() {
    var player = document.getElementsByTagName('audio')[0];
    player.play();
  }, 2000);
  $('#play').hide();
  $('#pause').show();

  var title = p.split('_')[ p.split('_').length-1 ].split('.')[0];
  document.getElementById('title').innerHTML = title;

  player.addEventListener('loadeddata', function() {
    var d = player.duration;
    var c = player.currentTime;
    var time = Math.floor(c/3600).pad()+':'+Math.floor((c%3600)/60).pad()+':'+Math.floor(c%60).pad()+' / '+Math.floor(d/3600).pad()+':'+Math.floor((d%3600)/60).pad()+':'+Math.floor(d%60).pad();
    document.getElementById('time').innerHTML = time;
  });

  player.addEventListener('timeupdate', function() {
    var d = player.duration;
    var c = player.currentTime;
    var w = window.innerWidth;
    if (p != 'NaN') {
      $('#progression').width(Math.floor((w-108)*(c/d)));
    }
    var time = Math.floor(c/3600).pad()+':'+Math.floor((c%3600)/60).pad()+':'+Math.floor(c%60).pad()+' / '+Math.floor(d/3600).pad()+':'+Math.floor((d%3600)/60).pad()+':'+Math.floor(d%60).pad();
    document.getElementById('time').innerHTML = time;
  });

  player.addEventListener('ended', function() {
    $('#pause').hide();
    $('#play').show();
    var s = decodeURI(player.src);
    var n = s.split('_')[s.split('_').length-1].split('.')[0];
    if ($('a:contains("'+n+'")').first().next().length > 0) {
      playFile($('a:contains("'+n+'")').first().next().attr('onclick').split('\'')[1]);
    }
  });

}

$$.post('http://app.fifi.dk/content.php', function (d) {

  var obj = JSON.parse(d);
  divGenerator(obj);

});
