{% extends 'home:page/layout.tpl' %}

{% block content %}
 	{%require 'home:static/comm/comm.less'%}
 	{%require 'home:static/comm/icon.less'%}
 	{%require 'home:component/list1.less'%}
 	{%require 'home:component/list2.less'%}
	{%script%}
		require('home:static/lib/zepto.js');
		require('home:static/lib/aa.js');
		require('home:static/comm/gps.js');
		require('home:static/js/index.js');
	{%endscript%}
{% endblock %}