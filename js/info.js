data = {
	ind: 0,
	cur: "",
	menus: {
		summary: "简介",
		back: "会师背景",
		process: "会师过程",
		place: "会师地位",
		figure: "会师人物",
		history: "会师史料",
		video: "视频资料"
	},

	init: function (s, hid) {
		data.initButton(hid);
		data.selectFram(s);
	},

	initButton: function (hid) {
		for (var s in data.btns) {
			var d = document.createElement("div");
			d.className = "button noselected";
			if (hid === true) {
				d.style.visibility = "hidden";
				title.style.visibility = "hidden";
			}
			d.innerHTML = s;
			d.onclick = data.changeFram;
			data.btns[s].div = d;
			data.bar.appendChild(d);
		}
		data.up.onclick = data.pageUp;
		data.dw.onclick = data.pageDown;
	},

	changeFram: function (e) {
		var tar = window.event.srcElement || e.target;
		data.selectFram (tar.innerHTML);
	},

	selectFram: function (s) {
		if (data.cur != s) {
			if (data.cur !== "") {
				data.btns[data.cur].div.className = "button noselected";
			}
			data.btns[s].div.className = "button noselected select";
			data.cur = s;
		}
		data.ind = 0;
		data.showPage();
		data.flush();
	},

	pageUp: function () {
		data.ind --;
		data.showPage();
		data.flush();
	},

	pageDown: function () {
		data.ind ++;
		data.showPage();
		data.flush();
	},

	showPage: function () {
		if (data.btns[data.cur].length) {
			var count = data.btns[data.cur].length;
			var i = data.ind + 1;
			data.num.innerHTML = "第 " + i + " 页，共 " + count + " 页";
			if (i === 1) {
				data.up.style.visibility = "hidden";
			} else {
				data.up.style.visibility = "visible";
			}
			if (i === count) {
				data.dw.style.visibility = "hidden";
			} else {
				data.dw.style.visibility = "visible";
			}
		} else {
			data.up.style.visibility = "hidden";
			data.dw.style.visibility = "hidden";
			data.num.innerHTML = "";
		}
	},

	flush: function () {
		data.frm.innerHTML = "";
		var ifm = document.createElement("IFRAME");
		ifm.src = data.btns[data.cur][data.ind];
		ifm.className = "content";
		data.frm.appendChild(ifm);
	},

	buildPalyer: function (d, path, file) {
		var e = document.createElement("embed");
		e.setAttribute ("src", path + "flvplayer.swf");
		e.setAttribute ("class", "play");
		e.setAttribute ("type", "application/x-shockwave-flash");
		e.setAttribute ("allowFullScreen", "true");
		e.setAttribute ("FlashVars", "vcastr_file=" + file);
		e.setAttribute ("quality", "high");
		e.setAttribute ("pluginspage", "http://www.macromedia.com/go/getflashplayer");
		d.appendChild(e);
	},


// ------------------ 视频 -------------------



	buildVideo: function (vd) {
		for (var i = 0; i<vd.vs.length; i++) {
			var out = document.createElement("div");
			out.className = "out noselected";
			out.dat = {
				root: vd,
				id: i
			};
			out.onclick = data.showVideo;

			var img = document.createElement("div");
			img.className = "img";
			img.style.backgroundImage = "url(" + vd.vs[i].pic + ")";

			var txt = document.createElement("div");
			txt.innerHTML = vd.vs[i].name;
			txt.className = "txt";
			
			out.appendChild(img);
			out.appendChild(txt);
			vd.main.appendChild(out);
		}
		vd.closee.dat = vd;
		vd.closee.onclick = data.hidVideo;
	},

	showVideo: function (e) {
		var tar = window.event.srcElement || e.target;
		while (tar.className != "out noselected") {
			tar = tar.parentNode;
		}
		var vd = tar.dat.root;
		vd.player.style.display = "";
		data.buildPalyer (vd.player, vd.path, vd.vs[tar.dat.id].file);
	},

	hidVideo: function (e) {
		var tar = window.event.srcElement || e.target;
		var vd = tar.dat;
		vd.player.style.display = "none";
		vd.player.removeChild(vd.player.lastChild);
	},


// ------------------ Info -------------------


	// 生成info的界面
	buildInfo: function (id, infoBarBackImg) {
		info.innerHTML = LZR.loadByAjax("../../info.htm");
		title.innerHTML = data.menus[id];
		data.bar = infoBar;
		data.frm = infoFram;
		data.up = pageUp;
		data.num = pageNum;
		data.dw = pageDown;

		if (infoBarBackImg) {
			var s = infoBar.className;
			infoBar.className = s + " " + infoBarBackImg;
		}

		var d = document.createElement("div");
		d.className = "item";
		d.innerHTML = "首页";
		var a = document.createElement("a");
		a.href = "../../index.html";
		a.appendChild(d);
		menu.appendChild(a);

		for (var s in data.menus) {
			d = document.createElement("div");
			if (s == id) {
				d.className = "item select";
			} else {
				d.className = "item";
			}
			d.innerHTML = data.menus[s];
			a = document.createElement("a");
			a.href = "../../web/" + s + "/info.html";
			a.appendChild(d);
			menu.appendChild(a);
		}
	}
};

LZR = {};

// 用于同步加载其它类的简易 Ajax 对象
LZR.spAjax = null;	/*as:Object*/

// Ajax 形式加载文本
LZR.loadByAjax = function (path/*as:string*/) {
	if (this.spAjax === null) {
		try{
			this.spAjax = new XMLHttpRequest();
		} catch (MSIEx) {
			var activeX = [ "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP" ];
			for (var i=0; i < activeX.length; i++) {
				try {
					this.spAjax = new ActiveXObject( activeX[i] );
				} catch (e) {}
			}
		}
		if (this.spAjax === null) {
			this.spAjax = "null";
			return null;
		} else {
			this.spAjax.LZR_domHead_ = document.getElementsByTagName("HEAD").item(0);
		}
	} else if (this.spAjax === "null") {
		return null;
	}

	//采用同步加载
	this.spAjax.open("GET", path, false);

	//发送同步请求
	this.spAjax.send(null);

	//4代表数据发送完毕
	if ( this.spAjax.readyState == 4 ) {
		//0为访问的本地，200到300代表访问服务器成功，304代表没做修改访问的是缓存
		if((this.spAjax.status >= 200 && this.spAjax.status <300) || this.spAjax.status === 0 || this.spAjax.status == 304) {
			return this.spAjax.responseText;
		}
	}
	return null;
};

