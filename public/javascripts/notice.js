	function add_item(){
			// pre_set 에 있는 내용을 읽어와서 처리..
			var div = document.createElement('div');
			div.innerHTML = document.getElementById('pre_set').innerHTML;
			document.getElementById('field').appendChild(div);
	}

	function remove_item(obj){
		// obj.parentNode 를 이용하여 삭제
		document.getElementById('field').removeChild(obj.parentNode);
	}
////////////////////////////////////////////////////////////////////////////
