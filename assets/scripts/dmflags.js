document.getElementById('dmFlagsBtn').addEventListener('click', function() {
	document.getElementById('dmflagsPopup').showModal();
});

const dmFlagCheckboxes = Array
	.from(
		document.querySelectorAll('#dmflags input[type="checkbox"')
	)
	.reverse();

let dmFlagCount = parseInt(document.querySelector('input[name="dmflags"]').value);
  
dmFlagCheckboxes.forEach((dmflag) => {
	if ((dmFlagCount - parseInt(eval(dmflag.value))) >= 0) {
		dmFlagCount -= parseInt(eval(dmflag.value));
		dmflag.checked = true;
	}
	
	dmflag.addEventListener('change', function() {
		const dmflags = document.querySelector('input[name="dmflags"]');
		const dmflagValue = eval(dmflag.value);
		
		if (dmflag.checked) {
			dmflags.value = parseInt(dmflags.value) + dmflagValue;
		} else {
			dmflags.value = parseInt(dmflags.value) - dmflagValue;
		}
	});
});

document.querySelectorAll('.dialog-close').forEach((closeBtn) => {
	closeBtn.addEventListener('click', function() {
		closeBtn.parentNode.close();
	});
});