let dragSrcEl = null;
  
/**
 * Handle the drag start
 * @param	{Event}	e	The event
 */
function handleDragStart(e) {
	if (e.target.tagName == 'BUTTON') return;
	  
    e.target.style.opacity = '0.4';
    
    dragSrcEl = e.target;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
}

/**
 * Handle the drag over
 * @param	{Event}	e	The event
 */
function handleDragOver(e) {
    if (e.preventDefault) {
		e.preventDefault();
    }

    e.dataTransfer.dropEffect = 'move';
    
    return false;
}

/**
 * Handle the drag enter
 * @param	{Event}	e	The event
 */
function handleDragEnter(e) {
    e.target.classList.add('over');
}

/**
 * Handle the drag leave
 * @param	{Event}	e	The event
 */
function handleDragLeave(e) {
    e.target.classList.remove('over');
}

/**
 * Handle the drag drop
 * @param	{Event}	e	The event
 */
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

/**
 * Handle the drag end
 * @param	{Event}		e	The event
 * @return 	{Boolean}
 */
function handleDragEnd(e) {
    e.target.style.opacity = '1';
    
    document.querySelectorAll('li.over').forEach(function (item) {
		item.classList.remove('over');
    });
	
	updateMapList();
}