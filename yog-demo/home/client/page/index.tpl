{% extends 'home:page/layout.tpl' %}

{% block content %}
     <div id="pages-container">
        {% widget "home:widget/message/message.tpl"%}
     </div>
     {%script%}
     	require('home:static/js/index.js');
     {%endscript%}
{% endblock %}