
var rinyGetChild=function(el,cla){
	this.node=el.childNodes;
	this.newArr=[];

	this.nodeFor=function(arr){
		for(var i=0;i<arr.length;i++){
			if(arr[i].nodeType==1 && arr[i].className.split(' ').indexOf(cla)!=-1){
				this.newArr.push(arr[i]);
			};
			if(arr[i].childNodes){
				this.nodeFor(arr[i].childNodes);
			}else{
				return;
			};
		};
	};

	this.nodeFor(this.node);

	return this.newArr;
};

var rinyCalendar=function(option){
	this.date=new Date();
	this.today=this.date.getDate();
	this.toweek= this.date.getDay()==0? 7 : this.date.getDay();
	this.tomonth=this.date.getMonth();
	this.toyear=this.date.getFullYear();
	this.m= option.m || option.m==0 ? option.m : this.tomonth;

	if(!option.weeksTemplate || option.weeksTemplate.indexOf('weeksTemplate')==-1){
		console.error('you need weeksTemplate');
		return;
	};

	var defWeek=['周一','周二','周三','周四','周五','周六','周日'];
	if(option.weeksText){
		defWeek=option.weeksText;
	};
	this.weekHtml='';
	for(var l=0;l<defWeek.length;l++){
		this.weekHtml+=option.weeksTemplate.replace('weeksTemplate','<span class="rinyCalendar_week" rinyweek="'+defWeek[l]+'">'+defWeek[l]+'</span>');
	};

	option.weeksInner.innerHTML=this.weekHtml;

	this.dayInner=function(curyear,curmonth,lastDay,firstDayWeek){

		option.yearInner.textContent=curyear;
		option.yearInner.setAttribute('rinyyear',curyear);
		option.monthInner.textContent=curmonth;
		option.monthInner.setAttribute('rinymonth',curmonth);

		if(!option.daysTemplate || option.daysTemplate.indexOf('daysTemplate')==-1){
			console.error('you need daysTemplate');
			return;
		};

		var html='';
		for(var i=0;i<firstDayWeek-1;i++){
			var blank=option.daysTemplate.replace('daysTemplate','<span class="rinyCalendar_blank"></span>');
			html+=blank;
		};
		for(var j=0;j<lastDay;j++){
			var day=option.daysTemplate.replace('daysTemplate','<span class="rinyCalendar_day" rinyday='+(j+1)+'>'+(j+1)+'</span>');
			html+=day;
		};

		var beInnerNum=firstDayWeek-1+lastDay;
		var line=Math.ceil(beInnerNum/7);
		var afterBlankNum=line*7-beInnerNum;

		for(var k=0;k<afterBlankNum;k++){
			var afterBlank=option.daysTemplate.replace('daysTemplate','<span class="rinyCalendar_blank"></span>');
			html+=afterBlank;
		};

		option.daysInner.innerHTML=html;

	};

	this.setCalendar=function(year,month){

		var curYear=year;
		var curMonth=month+1;

		var nextMonth=month+1;
		this.date.setDate(1);
		var firstDayWeek= this.date.getDay()==0? 7 : this.date.getDay();
		//这里需要注意，如果本月有31号而下个月没有，直接设置成下个月会变成下个月的31号，但由于下个月没有31号，所以会再到下一个月，就结果而言，会跳转到下下个月。
		//所以在这里可以先将日期设置成本月的首日，获取了星期之后再调整到下个月，毕竟每个月都有1号。
		this.date.setMonth(nextMonth);
		this.date.setDate(0);
		var lastDay=this.date.getDate();

		this.dayInner(curYear,curMonth,lastDay,firstDayWeek);

	};

	this.set=function(){
		//设置月份前都先把日期设到首日
		this.date.setDate(1);
		this.date.setMonth(this.m);
		this.setCalendar(this.date.getFullYear(),this.date.getMonth());
		
		var days=new rinyGetChild(option.daysInner,'rinyCalendar_day');
		for(var i=0;i<days.length;i++){
			var text=days[i].textContent;
			if(this.toyear==option.yearInner.textContent && this.tomonth+1==option.monthInner.textContent && this.today==text){
				days[i].className=days[i].className+' rinyCalendar_today';
			};
			if(option.yearInner.textContent<this.toyear || option.yearInner.textContent==this.toyear && option.monthInner.textContent<this.tomonth+1 || option.yearInner.textContent==this.toyear && option.monthInner.textContent==this.tomonth+1 && text<this.today){
				days[i].className=days[i].className+' rinyCalendar_oldday';
			};			
		};
	};
	this.set();

	this.prevMon=function(){
		this.m--;
		if(this.m==-2){
			this.m=10;
		};
		this.set();
	};

	this.nextMon=function(){
		this.m++;
		if(this.m==13){
			this.m=1;
		};
		this.set();
	};

	var _this=this;

	if(option.prevMonthBtn){
		option.prevMonthBtn.addEventListener('click',function(){
			_this.prevMon();
			option.prevFn && option.prevFn();
		},false);
	};

	if(option.nextMonthBtn){
		option.nextMonthBtn.addEventListener('click',function(){
			_this.nextMon();
			option.nextFn && option.nextFn();
		},false);
	};	
};