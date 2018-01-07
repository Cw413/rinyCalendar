;(function(obj){

	//日历类
	var rinyCalendar=function(options){

		var _this=this;
		this.options=options;
		this.date=new Date();
		this.today=this.date.getDate();
		this.toweek= this.date.getDay()==0? 7 : this.date.getDay();
		this.tomonth=this.date.getMonth();
		this.toyear=this.date.getFullYear();
		this.m= this.options.m || this.options.m==0 ? this.options.m : this.tomonth;
		this.html='';

		//根据类型初始化日历
		if(this.options.type=='horizontal'){
			this.horizontalInit();

		}else if(this.options.type=='vertical'){
			this.verticalInit();
		};

		this.chooseDate();

	};

	//设置日历
	rinyCalendar.prototype.setCalendar=function(){

		//把日期设置成本月的1号
		this.date.setDate(1);
		this.date.setMonth(this.m);

		this.curYear=this.date.getFullYear();
		this.curMonth=this.date.getMonth()+1;
		this.firstDayWeek= this.date.getDay()==0? 7 : this.date.getDay();

		//这里需要注意，如果本月有31号而下个月没有，而且今天正好是31号，此时，如果直接设置成下个月理论上会变成下个月的31号，但由于下个月没有31号，所以会继续往后跳一个月，就结果而言，会跳转到下下个月。
		//为了解决这个问题，一开始就把日期设置成了本月的1号，毕竟每个月都有1号。而且，我们也正需要把日期设置成1号以获取本月1号是星期几。
		this.date.setMonth(this.curMonth);
		this.date.setDate(0);
		this.lastDay=this.date.getDate();

		//获取上个月的最后一天
		var ren=(this.curYear % 400 == 0 || (this.curYear % 100 != 0 && this.curYear % 4 == 0)) ? 29 : 28,
			arr=[31,ren,31,30,31,30,31,31,30,31,30,31];
		this.prevMonthLastDay=arr[this.curMonth-2];	//this.curMonth为实际显示的月份，要从0开始的话，需要减2。
		if(!this.prevMonthLastDay){
			this.prevMonthLastDay=31;
		};

	};

	//生成年节点
	rinyCalendar.prototype.createYearNode=function(){

		this.yearNode=document.createElement('span');
		this.yearNode.textContent=this.curYear+'年';
		this.yearNode.className='riny_calendar_year';

	};

	//生成月节点
	rinyCalendar.prototype.createMonthNode=function(){

		this.monthNode=document.createElement('span');
		this.monthNode.textContent=this.curMonth+'月';
		this.monthNode.className='riny_calendar_month';

	};

	//生成周节点
	rinyCalendar.prototype.createWeekNode=function(){

		var defWeek=['周日','周一','周二','周三','周四','周五','周六'];
		if(this.options.weeksText){
			defWeek=this.options.weeksText;
		};

		this.weekHtml='';
		var weekendClass;
		for(var l=0;l<defWeek.length;l++){
			
			weekendClass='';
			if(l%7==6 || l%7==0){
				weekendClass='riny_calendar_weekend';
			};

			this.weekHtml+='<span class="'+weekendClass+'">'+defWeek[l]+'</span>';
		};

		this.weekNode=document.createElement('div');
		this.weekNode.className='riny_calendar_week';
		this.weekNode.innerHTML=this.weekHtml;

	};

	//生成日节点
	rinyCalendar.prototype.createDayNode=function(){
		
		this.html='';
		var day,weekendClass;

		for(var i=0;i<42;i++){

			weekendClass='';

			if(i%7==6 || i%7==0){
				weekendClass='riny_calendar_weekend';
			};

			if(i<this.firstDayWeek){

				this.html+='<span class="riny_calendar_blank '+weekendClass+'">'+(this.prevMonthLastDay-this.firstDayWeek+1+i)+'</span>';

			}else if(i>=this.firstDayWeek && i<this.lastDay+this.firstDayWeek){

				day='<span class="riny_calendar_day '+weekendClass+'" rinycalendardate='+this.curYear+'-'+this.curMonth+'-'+(i-this.firstDayWeek+1)+'>'+(i-this.firstDayWeek+1)+'</span>';
			
				if(this.toyear==this.curYear && this.tomonth+1==this.curMonth && this.today==i-this.firstDayWeek+1){
					
					day='<span class="riny_calendar_day riny_calendar_today '+weekendClass+'" rinycalendardate='+this.curYear+'-'+this.curMonth+'-'+(i-this.firstDayWeek+1)+'>'+(i-this.firstDayWeek+1)+'</span>';
				
				}else if(this.curYear<this.toyear || this.curYear==this.toyear && this.curMonth<this.tomonth+1 || this.curYear==this.toyear && this.curMonth==this.tomonth+1 && i-this.firstDayWeek+1<this.today){
					
					day='<span class="riny_calendar_day riny_calendar_oldday '+weekendClass+'" rinycalendardate='+this.curYear+'-'+this.curMonth+'-'+(i-this.firstDayWeek+1)+'>'+(i-this.firstDayWeek+1)+'</span>';
				};

				this.html+=day;

			}else{

				this.html+='<span class="riny_calendar_blank '+ weekendClass+'">'+(i-this.firstDayWeek-this.lastDay+1)+'</span>';

			};
		};

		this.daysNode=document.createElement('div');
		this.daysNode.className='riny_calendar_days';
		this.daysNode.innerHTML=this.html;

	};

	//初始化水平日历
	rinyCalendar.prototype.horizontalInit=function(){

		var fragment=document.createDocumentFragment();

		this.setCalendar();
		this.createWeekNode();
		this.createYearNode();
		this.createMonthNode();
		this.createDayNode();

		fragment.appendChild(this.yearNode);
		fragment.appendChild(this.monthNode);
		fragment.appendChild(this.weekNode);
		this.options.YMWWrap.appendChild(fragment);
		this.options.daysWrap.appendChild(this.daysNode);

		this.turnBtn();

	};

	//初始化垂直日历
	rinyCalendar.prototype.verticalInit=function(){

		var fragment,
			wholeFragment=document.createDocumentFragment();

		for(var i=0;i<this.options.num;i++){

			fragment=document.createDocumentFragment();
			this.setCalendar();
			this.createWeekNode();
			this.createYearNode();
			this.createMonthNode();
			this.createDayNode();

			fragment.appendChild(this.yearNode);
			fragment.appendChild(this.monthNode);
			fragment.appendChild(this.weekNode);
			fragment.appendChild(this.daysNode);
			wholeFragment.appendChild(fragment);

			this.m++;

		};

		this.options.wrap.appendChild(wholeFragment);

	};

	//过滤m值(m值为用作设置月份的值)
	rinyCalendar.prototype.mFilter=function(){

		if(this.m>11){
			this.m=this.m%12;
		}else if(this.m<0){
			this.m=this.m%12+12;
		};

	};

	//翻页
	rinyCalendar.prototype.pageTurn=function(){

		this.setCalendar();
		this.yearNode.textContent=this.curYear+'年';
		this.monthNode.textContent=this.curMonth+'月';
		this.createDayNode();
		this.options.daysWrap.appendChild(this.daysNode);

	};

	//翻页按钮
	rinyCalendar.prototype.turnBtn=function(){

		var _this=this;

		if(this.options.prevMonthBtn){
			this.options.prevMonthBtn.addEventListener('click',function(){
				_this.mFilter();
				_this.m--;
				_this.removeDaysElement=_this.daysNode;
				_this.pageTurn();

				//翻页回调
				_this.options.prevFn && _this.options.prevFn(_this.removeDaysElement,_this.daysNode,_this.options.daysWrap);
			},false);
		};

		if(this.options.nextMonthBtn){
			this.options.nextMonthBtn.addEventListener('click',function(){
				_this.mFilter();
				_this.m++;
				_this.removeDaysElement=_this.daysNode;
				_this.pageTurn();

				_this.options.nextFn && _this.options.nextFn(_this.removeDaysElement,_this.daysNode,_this.options.daysWrap);
			},false);
		};

	};

	rinyCalendar.prototype.chooseDate=function(){

		this.options.wrap.addEventListener('click',function(e){

			if(e.target.className.split(' ').indexOf('riny_calendar_day')!=-1){
				console.log(
					{
						year:e.target.getAttribute('rinycalendardate').split('-')[0],
						month:e.target.getAttribute('rinycalendardate').split('-')[1],
						day:e.target.getAttribute('rinycalendardate').split('-')[2]
					}
				);
			};

			//数据输出可以绑定到this.options.wrap或者用回调函数返回。

		},false);

	};

	//暴露
	obj.rinyCalendar=rinyCalendar;

})(window);