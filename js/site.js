$(document).ready(function() {
	$("#tracks ul").perfectScrollbar({
    suppressScrollX: true
  });

  var scEmbed = document.getElementById("sc-embed");
  var scWidget = SC.Widget(scEmbed);
  /*var progressPercent;*/
  var timePlayed, trackAmount, nowPlaying;

  var readableTime = function(ms) {
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  scWidget.bind(SC.Widget.Events.READY, function(e){
    scWidget.getSounds(function(songs) {
      console.log(songs);
      trackAmount = songs.length;
      for (n=0;n<songs.length;n++) {
        $("#tracklist").append("<li data-track='" + n + "' data-url='" + songs[n].permalink_url + "'><strong>" + songs[n].title + "</strong><small>" + readableTime(songs[n].duration) + "</small></li>");
      }

      $("#tracklist li").on("click", function(){
        var skipTo = $(this).attr("data-track");
        scWidget.skip(skipTo);
        $("#sc-play").addClass("playing");
      });
    });
    $("#sc-next").on("click", function(e){
      if(nowPlaying === trackAmount) {
        scWidget.skip(0);
      } else {
        scWidget.next();
      }
      e.preventDefault();
    });
    $("#sc-prev").on("click", function(e){
      if(nowPlaying === 1) {
        scWidget.skip(trackAmount - 1);
      } else {
        scWidget.prev();
      }
      e.preventDefault();
    });
    $("#sc-play").on("click", function(e){
      scWidget.toggle();
      $(this).toggleClass("playing");
      e.preventDefault();
    });
    $("#sc-mute").on("click", function(e){
      if ($(this).is(".muted")) {
        scWidget.setVolume(100);
        $(this).removeClass("muted");
      } else {
        scWidget.setVolume(0);
        $(this).addClass("muted");
      }
      e.preventDefault();
    });
    $("#sc-link").on("click", function(){
      scWidget.pause();
    });
  });
  scWidget.bind(SC.Widget.Events.PLAY, function(playing){
    scWidget.getCurrentSoundIndex(function(trackNo) {
      nowPlaying = trackNo + 1;
      var scLink = $("#tracklist li[data-track=" + trackNo + "]").attr("data-url");
      $("#tracklist li").removeClass("playing");
      $("#tracklist li[data-track=" + trackNo + "]").addClass("playing");
      $("#sc-link").attr("href", scLink);
    });
    $("#sc-play").addClass("playing");
    $("#tracklist li.playing").removeClass("paused");
  });
  scWidget.bind(SC.Widget.Events.PLAY_PROGRESS, function(progress){
    progressPercent = progress.relativePosition * 100;
    $("#sc-progress").width(progressPercent + "%");
    timePlayed = readableTime(progress.currentPosition);
    $("#sc-time").html(timePlayed);
  });
  scWidget.bind(SC.Widget.Events.FINISH, function(e){
    if(nowPlaying === trackAmount) {
      scWidget.skip(0);
      scWidget.pause();
      $("#sc-play").removeClass("playing");
    }
  });
  scWidget.bind(SC.Widget.Events.PAUSE, function(e){
    $("#sc-play").removeClass("playing");
    $("#tracklist li.playing").addClass("paused");
  });
});