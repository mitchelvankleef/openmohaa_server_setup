var dragSrcEl = null;
  
function handleDragStart(e) {
	if (e.target.tagName == 'BUTTON') return;
	  
    e.target.style.opacity = '0.4';
    
    dragSrcEl = e.target;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
		e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';
    
    return false;
}

function handleDragEnter(e) {
    e.target.classList.add('over');
}

function handleDragLeave(e) {
    e.target.classList.remove('over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
		e.stopPropagation();
    }
    
    if (dragSrcEl != e.target) {
		dragSrcEl.innerHTML = e.target.innerHTML;
		e.target.innerHTML = e.dataTransfer.getData('text/html');
    }
    
    return false;
}

function handleDragEnd(e) {
    e.target.style.opacity = '1';
    
    document.querySelectorAll('li.over').forEach(function (item) {
		item.classList.remove('over');
    });
	
	updateMapList();
}