/**
 * Created by tianhao on 17-3-23.
 */
;(function ($) {
    $.extend({
		
		"musicPlayer":function(options){
			
			options = $.extend({
				autoPlay:true,
				loop:true,
                list: [
					{
						title: "燕归巢",
						author: "张杰＆张靓颖",
						cover: "http://p4.music.126.net/gYwk-n_UWAtOfDZBEV04dQ==/7699879929738059.jpg",
						music: "http://p2.music.126.net/bunDefkBnWf_XekMxxdLNA==/19147994997736977.mp3",
					}
				]
            },options);
			
			var html =  '<div id="floatCD" class="floatCD" ondragstart="return false;">                                             '+
						'	<div class="line"></div>                                                                               '+
						'	<img data-action="cd" class="cd">                                                                      '+
						'	<div title="暂停" data-action="pause" class="player pause"></div>                                      '+
						'	<div title="播放" data-action="play" class="player play"></div>                                        '+
						'	<div title="上一曲" data-action="prev" class="player prev"></div>                                      '+
						'	<div title="下一曲" data-action="next" class="player next"></div>                                      '+
						'	<div title="列表" data-action="list" class="player list"></div>                                        '+
						'	                                                                                                       '+
						'	<audio id="musicPlayer" '+((options.autoPlay) ? "autoPlay" : "")+'></audio>                              '+
						'	                                                                                                       '+
						'	<!-- Begin -->                                                                                         '+
						'	<div id="Thplayer" class="Thplayer player-bgColor">                                                    '+
						'		<div id="player-demo">                                                                             '+
						'			<img data-action="cd" class="cd"/>                                                             '+
						'			                                                                                               '+
						'			<div title="暂停" data-action="pause" class="player pause"></div>                              '+
						'			<div title="播放" data-action="play" class="player play"></div>                                '+
						'			<div title="上一曲" data-action="prev" class="player prev"></div>                              '+
						'			<div title="下一曲" data-action="next" class="player next"></div>                              '+
						'			<div id="player-close" class="close-icon">×</div>                                              '+
						'			                                                                                               '+
						'			<div id="player-info" class="player-info">                                                     '+
						'				<strong class="title player-showFount"></strong>                                           '+
						'				<span class="and player-showFount">-</span>                                                '+
						'				<span class="author player-showFount"></span>                                              '+
						'			</div>                                                                                         '+
						'			<div id="player-control" class="player-control">                                               '+
						'				<span class="left-time player-showFount"></span>                                           '+
						'				<span class="and player-showFount">/</span>                                                '+
						'				<span class="right-time player-showFount"></span>                                          '+
						'			</div>                                                                                         '+
						'			                                                                                               '+
						'			<div id="player-process" class="player-process">                                               '+
						'				<div id="player-current" class="player-current"></div>                                     '+
						'				<span style="left:0px;"></span>                                                            '+
						'			</div>                                                                                         '+
						'			<div class="player-listbox playerbox-show">                                                    '+
						'				<div class="searchBox">                                                                    '+
						'					<input type="text" id="txtSong" placeholder="请输入歌曲名称，例如：七里香 周杰伦..." />'+
						'					<img src="./img/search.png" id="btnSearch" class="btnSearch"/>                         '+
						'				</div>                                                                                     '+
						'				<table class="th-list-table player-bgImg">                                                 '+
						'				   <thead>                                                                                 '+
						'					<tr style="display:block;padding:0 20px;color:#999">                                   '+
						'					 <th style="padding-right:160px" class="player-showFountTitle">歌名</th>               '+
						'					 <th class="player-showFountTitle">歌手</th>                                           '+
						'					</tr>                                                                                  '+
						'				   </thead>                                                                                '+
						'				   <tbody id="UserList" class="UserList">                                                  '+
						'					                                                                                       '+
						'				   </tbody>                                                                                '+
						'				   <tfoot>                                                                                 '+
						'					<tr id="LoadMore" class="LoadMore" offset="0" search="0">                              '+
						'						<td colspan="8">点击加载更多数据</td>                                              '+
						'					</tr>                                                                                  '+
						'				   </tfoot>                                                                                '+
						'			  </table>                                                                                     '+
						'			</div>                                                                                         '+
						'		</div>                                                                                             '+
						'	</div>                                                                                                 '+
						'</div>                                                                                                    ';
			
			$("body").append(html);
			
			// 音乐数量
			var musicSize = 0;
			// 当前播放音乐索引
			var currentIndex = 0;
			
			// 播放器
			var musicPlayer = document.getElementById("musicPlayer");
			// 转盘 CD
			var cdImg = $("#floatCD img[data-action=cd]");
			// 播放按钮
			var playBtn = $("#floatCD div[data-action='play']");
			// 暂停按钮
			var pauseBtn = $("#floatCD div[data-action='pause']");
			// 上一曲按钮
			var prevBtn = $("#floatCD div[data-action='prev']");
			// 下一曲按钮
			var nextBtn = $("#floatCD div[data-action='next']");
			// 列表按钮
			var listBtn = $("#floatCD div[data-action='list']");
			
			// 音乐已播放时长
			var playTime = $("#player-control .left-time");
			// 音乐总时长
			var totalTime = $("#player-control .right-time");
			
			// 音乐名称
			var musicName = $("#player-info .title");
			// 歌手
			var singer = $("#player-info .author");
			
			
			// 进度条，已播放进度
			var playerLeftprocess = $("#player-process span");
			// 进度条，未播放进度
			var playerRightprocess = $("#player-current");
			
			// 当播放清单不为空时
			if ($.type(options.list) == "array" && options.list.length > 0) {
				musicPlay(0);
				musicSize = options.list.length;
				currentIndex = 0;
				loadMusicList();
			}
			
			setInterval(function (){
				if (parseInt(musicPlayer.currentTime%60) < 10){
					var seconds = "0"+parseInt(musicPlayer.currentTime % 60);
				}
				else{
					var seconds = parseInt(musicPlayer.currentTime%60);
				}
				playTime.text(parseInt(musicPlayer.currentTime/60)+":"+seconds);
				playerLeftprocess.css("left",(musicPlayer.currentTime/musicPlayer.duration)*200+"px");
				playerRightprocess.css("width",(musicPlayer.currentTime/musicPlayer.duration)*200+"px");
			},1000);
			
			/*
			 * 播放器 事件
			 */
			// 媒介已就绪可以开始播放时
			musicPlayer.onplay = function() {
				playBtn.hide();
				pauseBtn.show();
				CDRound(true);
			};
			// 开始播放时，获取歌曲时长
			musicPlayer.onplaying = function() {
				getSongTime();
			};
			// 暂停播放时
			musicPlayer.onpause = function() {
				playBtn.show();
				pauseBtn.hide();
				CDRound(false);
			};
			// 播放完成后，自动播放下一曲
			musicPlayer.onended = function() {
				// 当为最后一曲且禁止自动循环时
				if (currentIndex == musicSize - 1 && !options.loop) {
					return false;
				}
				// 播放下一曲
				musicPlayNext();
			};
			// 错误，2秒后播放下一曲
			musicPlayer.onerrorNew = function() {
				setTimeout(function(){
					musicPlayNext();
				},2000);
			};
			
			/*
			 * jquery Event
			 */
			 // 播放按钮动作
			 // data-action
			 playBtn.click(function(){
				 musicPlayer.play();
			 });
			 // 暂停按钮动作
			 pauseBtn.click(function(){
				 musicPlayer.pause();
			 });
			 // 上一曲按钮动作
			 prevBtn.click(function(){
				currentIndex = (currentIndex != 0) ? currentIndex - 1 : musicSize - 1;
				musicPlay(currentIndex);
			 });
			 // 下一曲按钮动作
			 nextBtn.click(function(){
				 musicPlayNext();
			 });
			 // 列表按钮动作
			 listBtn.click(function(){
				closeOrOpenPlayer();
			 });
			 
			 $("#player-close").click(function(){
				 closeOrOpenPlayer();
			 });
			 
			 $("#btnSearch").click(function () {
                getAjax();
             });

             $("#txtSong").keydown(function(event){
                if (event.keyCode==13){
                    getAjax();
                }
             });
			
			// CD 鼠标悬停，暂停动画
			$("#floatCD .player, #floatCD img[data-action=cd]").hover(
				function(){
					CDRound(false);
				},
				function(){
					CDRound(!musicPlayer.paused);
				}
			);
			
			/*
			 * custom function
			 */
			 // 打开或关闭播放列表
			 function closeOrOpenPlayer(){
				 
				if ($("#Thplayer").css("right") == 0+"px"){
					
					$("#floatCD").animate({top: '0px'}, "slow");
					$("#Thplayer").animate({right: '-350px'}, "slow");
                }
				else {
                    $("#Thplayer").animate({right: '0px'}, "slow");
					$("#floatCD").animate({top: '-135px'}, "slow");
                }
			 }
			// CD 暂停/旋转
			function CDRound(round){
				var action = round ? "running" : "paused";
				cdImg.css({"animation-play-state":action,"-webkit-animation-play-state":action});
			}
			// 播放
			function musicPlay(index,json){
				
				var musicJson = (null !=index) ? options.list[index] : json;
				musicPlayer.src = musicJson.music;
				cdImg.attr({"title":musicJson.author + "：" + musicJson.title,"src":musicJson.cover});
				musicName.text(musicJson.title);
				singer.text(musicJson.author);
				musicPlayer.play();
			}
			// 播放下一曲
			function musicPlayNext() {
				currentIndex = (currentIndex < musicSize - 1) ? currentIndex + 1 : 0;
				musicPlay(currentIndex);
			}
			// 获取歌曲时长
			function getSongTime(){
				if (parseInt(musicPlayer.duration % 60) < 10.0){
					var seconds = "0" + parseInt(musicPlayer.duration % 60);
				}
				else {
					var seconds = parseInt(musicPlayer.duration % 60);
				}
				totalTime.text(parseInt(musicPlayer.duration / 60) + ":"+seconds);
            }
			// 加载音乐列表
			function loadMusicList(songsList){
				// 音乐列表
				var arry = songsList ? songsList : options.list;
				var str = "";
				
				$.each(arry,function(i,json){
					
					str += '<tr class="am-btn am-btn-primary am-radius BeginPlay" url="'+json.music+'" img="'+json.cover+'" singer="'+json.author+'" name="'+json.title+'">'+
								'<td style="width:200px;">'+json.title+'</td>'+
								'<td>'+json.author+'</td>'+
							'</tr>';
				});
				
				var html = $(str);
				
				// 列表行点击事件
				html.click(function(){
					var json = {
						music:$(this).attr("url"),
						cover:$(this).attr("img"),
						author:$(this).attr("singer"),
						title:$(this).attr("name")
					}
					musicPlay(null,json);
				})
				
				$("#UserList").append(html);
				$("#LoadMore").toggle(!(null == songsList));
			}
			
			function getAjax(){
                if ($("#LoadMore").attr("Search") == "0") {
                    $("#UserList").html("");
                    $("#LoadMore").attr("offset", "0")
                }
                /*
                 * Ajax请求获得歌曲歌手专辑信息
                 * */
                var Song = $("#txtSong").val();
                $.ajax({
                    url: "https://fm.aakuan.cn/GetMusic.ashx",
                    data: {SongName: Song, OffSet: $("#LoadMore").attr("offset")},
                    type: "get",
                    success: function (msg) {
                        var SongJson = JSON.parse(msg);
                        if (typeof SongJson.result.songs == undefined || typeof SongJson.result.songs == "undefined") {
                            $("#LoadMore").show();
                            $("#LoadMore td").text("对不起，没有更多数据了")
                        } else {
                            for (var i = 0; i < SongJson.result.songs.length; i++) {
                                $("#UserList").append("<tr class='am-btn am-btn-primary am-radius BeginPlay' url='" + SongJson.result.songs[i].mp3Url + "'   aid='" + SongJson.result.songs[i].album.id + "' mid='" + SongJson.result.songs[i].id + "' img='" + SongJson.result.songs[i].album.blurPicUrl + "' singer='" + SongJson.result.songs[i].artists[0].name + "' name='" + SongJson.result.songs[i].name.substring(0, 20) + "'><td style='width:200px;'>" + SongJson.result.songs[i].name.substring(0, 20) + "</td><td>" + SongJson.result.songs[i].artists[0].name + "</td></tr>");
                                $("#LoadMore").show();
                                $("#LoadMore td").text("点击加载更多数据")
                            }
                        }
                        $("#LoadMore").attr("Search", "0");
						
                        $("#LoadMore").click(function () {
                            var Tr_Length = $("#UserList tr").length;
                            $(this).attr("offset", Tr_Length);
                            $("#LoadMore").attr("Search", "1");
                            $("#btnSearch").click();
                            $("#LoadMore").unbind("click")
                        });
						
                        /*
                         * 播放网易云音源
                         * 
						 */
                        $(".BeginPlay").click(function () {
							
							var json = {
								music:$(this).attr("url"),
								cover:$(this).attr("img"),
								author:$(this).attr("singer"),
								title:$(this).attr("name")
							}
							
							musicPlay(null,json);
                        });
                    }
                });
            }
		}
    });
})(jQuery);