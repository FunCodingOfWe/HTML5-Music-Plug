/**
 * Created by tianhao on 17-3-23.
 */
;(function ($) {
    $.extend({
		
		"musicPlayer":function(options){
			
			options = $.extend({
				autoPlay:true,
				loop:true,
				volume:0.7,
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
						'	<!-- 顶部 mini 音乐播放器 Begin -->                                                                    '+
						'	<div class="line"></div>                                                                               '+
						'	<img data-action="cd" class="cd">                                                                      '+
						'	<div title="暂停" data-action="pause" class="player pause"></div>                                      '+
						'	<div title="播放" data-action="play" class="player play"></div>                                        '+
						'	<div title="上一曲" data-action="prev" class="player prev"></div>                                      '+
						'	<div title="下一曲" data-action="next" class="player next"></div>                                      '+
						'	<div title="列表" data-action="list" class="player list"></div>                                        '+
						'	<audio id="musicPlayer" '+((options.autoPlay) ? "autoPlay" : "")+'></audio>                            '+
						'	<!-- 顶部 mini 音乐播放器 End -->                                                                      '+
						'	<!-- 音乐播放器列表 Begin -->                                                                          '+
						'	<div id="Thplayer" class="Thplayer player-bgColor">                                                    '+
						'		<div id="player-demo">                                                                             '+
						'			<img id="player-album" class="album"/>                                                             '+
						'			<div title="暂停" data-action="pause" class="player pause"></div>                              '+
						'			<div title="播放" data-action="play" class="player play"></div>                                '+
						'			<div title="上一曲" data-action="prev" class="player prev"></div>                              '+
						'			<div title="下一曲" data-action="next" class="player next"></div>                              '+
						'			<div id="player-close" class="close-icon">×</div>                                              '+
						'			<div id="player-volume" class="player volume"></div>  									       '+
						'			<!-- 音乐名称/歌手 -->                                                                         '+
						'			<div id="player-info" class="player-info">                                                     '+
						'				<strong class="title player-showFount"></strong>                                           '+
						'				<span class="and player-showFount">-</span>                                                '+
						'				<span class="author player-showFount"></span>                                              '+
						'			</div>                                                                                         '+
						'			<!-- 音乐播放时间/总时长 -->                                                                   '+
						'			<div id="player-control" class="player-control">                                               '+
						'				<span class="left-time player-showFount"></span>                                           '+
						'				<span class="and player-showFount">/</span>                                                '+
						'				<span class="right-time player-showFount"></span>                                          '+
						'			</div>                                                                                         '+
						'			<!-- 音乐播放进度条 -->                                                                        '+
						'			<div id="player-process" class="player-process">                                               '+
						'				<div id="player-current" class="player-current"></div>                                     '+
						'				<span style="left:0px;"></span>                                                            '+
						'			</div>                                                                                         '+
						'			<!-- 音乐音量进度条 -->                                                                        '+
						'			<div id="player-volume-content" class="player-volume-content">                                 '+
						'				<div id="player-volume-top-line" class="top-line"></div>                                   '+
						'				<div id="player-volume-control" class="process"></div>                                     '+
						'				<div id="player-volume-bottoml-line" class="bottom-line"></div>                            '+
						'			</div>                                                                                         '+
						'			<!-- 搜索，歌单 -->                                                                            '+
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
						'																							               '+
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
						'	<!-- 音乐播放器列表 End -->  							                                               '+
						'</div>                                                                                                    ';
			
			$("body").append(html);
			
			// 音乐数量
			var musicSize = 0;
			// 当前播放音乐索引
			var currentIndex = 0;
			// 是否正在拖动进度条
			var dragging = false; 
			// 是否正在拖动音量进度条
			var volumeDragging = false; 
			// 默认音量
			var defaultVolume = options.volume;
			// 默认音量,记录拖动音量进度条之前的音量
			var defaultVolume2 = 0;
			// 进度条拖动量
			var iX, iY; 
			
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
			
			var playerVolume = $("#player-volume");
			
			// 音乐已播放时长
			var playTime = $("#player-control .left-time");
			// 音乐总时长
			var totalTime = $("#player-control .right-time");
			
			// 音乐名称
			var musicName = $("#player-info .title");
			// 歌手
			var singer = $("#player-info .author");
			
			// 音乐进度条控制
			var playerLeftprocess = $("#player-process span");
			var playerRightprocess = $("#player-current");
			
			// 音量进度条控制
			var playerVolumeContent = $("#player-volume-content");
			var volumeTopLine = $("#player-volume-top-line");
			var volumeControl = $("#player-volume-control");
			var volumeBottomlLine = $("#player-volume-bottoml-line");
			
			// 初始化音乐控制进度条
			setVolumeControl(defaultVolume);
			
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
				else {
					var seconds = parseInt(musicPlayer.currentTime%60);
				}
				playTime.text(parseInt(musicPlayer.currentTime/60)+":"+seconds);
				
				if (!dragging){
					playerLeftprocess.css("left",(musicPlayer.currentTime/musicPlayer.duration)*200+"px");
					playerRightprocess.css("width",(musicPlayer.currentTime/musicPlayer.duration)*200+"px");
				}
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
			 *  进度条事件
			 */
			// 按下播放进度条控制按钮时触发
			playerLeftprocess.mousedown(function(e) { 
				// true 表示正在拖动进度条
				dragging = true; 
				// 记录偏移量
				iX = e.clientX - this.offsetLeft; 
				// 一旦窗口捕获了鼠标，所有鼠标输入都针对该窗口
				this.setCapture && this.setCapture(); 
			}); 
			// 按下音量控制进度条时触发
			volumeControl.mousedown(function(e) {
				volumeDragging = true; 
				iY = e.clientY - this.offsetTop + 15; 
				this.setCapture && this.setCapture(); 
				if (defaultVolume != 0) {
					defaultVolume2 = defaultVolume;
				}
			});
			
			// 当鼠标移动时
			document.onmousemove = function(e) { 
				// 正在控制播放进度条
				if (dragging) { 
					var e = e || window.event; 
					// 记录鼠标移动量
					var oX = e.clientX - iX; 
					// 移动量最小0最大200，因为播放进度条最大长度200
					oX = (oX <= 0) ? 0 : ((oX >= 200) ? 200 : oX);
					// 设置进度条按钮位置
					playerLeftprocess.css("left", oX + "px");
					// 设置进度条以播放量
					playerRightprocess.css("width",oX + "px");
				}
				// 正在控制音乐进度条
				if (volumeDragging){
					var e = e || window.event; 
					// 记录鼠标移动量
					var oY = e.clientY - iY;
					// 最大100，最小0，因为音量进度条最大高度 100
					oY = (oY <= 0) ? 0 : ((oY >= 100) ? 100 : oY);
					
					changeVolume((100-oY) / 100);
				}
			}; 
			// 当松开鼠标按钮时
			$(document).mouseup(function(e) {
				// 如果是控制进度条，并且播放器未报错时，快进/快退
				if (dragging && null == musicPlayer.error && !isNaN(musicPlayer.duration)) {
					// 控制音乐快进/快退
					musicPlayer.currentTime = musicPlayer.duration * (playerRightprocess.width() / 200);
				}
				// 从当前线程中的窗口释放鼠标捕获
				e.target.releaseCapture && e.target.releaseCapture();
				// 是否控制进度条，改为否
				dragging = false; 
				volumeDragging = false; 
				// 阻止事件冒泡
				e.cancelBubble = true; 
			});
			
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
			
			// 鼠标正悬停在音量控制进度条上
			var volumeHover = false;
			
			// 静音/取消静音按钮悬停事件
			playerVolume.hover(
				function () {
					// 鼠标移至静音/取消静音按钮上时，显示音量控制进度条
					playerVolumeContent.show();
				},
				function () {
					// 鼠标离开静音/取消静音按钮时，如果1秒后鼠标没有对音量控制进度条操作，则关闭音量控制进度条
					setTimeout(function(){
						if (!volumeHover) {
							playerVolumeContent.hide();
							volumeHover = false;
						}
					},1000)
				}
			)
			.click(function(){
				// 如果有 class mute 表示当前是静音状态。
				if ($(this).hasClass("mute")){
					// 取消静音
					changeVolume(defaultVolume == 0 ? defaultVolume2 : defaultVolume);
				}
				else {
					// 开启静音
					changeVolume(0,true);
				}
				//$(this).toggleClass("mute");
			});
			// 音量控制进度条鼠标悬停事件
			playerVolumeContent.hover(
				function () {
					// 鼠标正悬停在音量控制进度条上
					volumeHover = true;
				},
				function () {
					// 鼠标离开音量控制进度条，隐藏进度条
					volumeHover = false;
					$(this).hide();
				}
			);
			
			 // 关闭音乐播放列表
			 $("#player-close").click(function(){
				 closeOrOpenPlayer();
			 });
			 
			 // 歌曲查询
			 $("#btnSearch").click(function () {
                getAjax();
             });
			
			// 按下回车，自动查询歌曲
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
				$("#player-album").attr("src",musicJson.cover);
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
			// 调整音量，volume 为音量，isMute 为true 时表示静音
			function changeVolume(volume,isMute){
				// 设置默认音量
				musicPlayer.volume = volume;
				// 如果不是静音，将默认音量设置为调整之后的音量
				if (!isMute) {
					defaultVolume = volume;
				}
				
				// 设置音量控制进度条
				setVolumeControl(volume);
			}
			
			// 设置音量进度条
			function setVolumeControl(volume){
				var height = volume * 100;
				volumeTopLine.height(100-height);
				volumeBottomlLine.height(height);
				
				if(volume == 0){
					playerVolume.addClass("mute");
				}
				else {
					playerVolume.removeClass("mute");
				}
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
