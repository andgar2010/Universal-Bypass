chrome.storage.local.get(["custom_bypasses"],result=>{
	let customBypasses=(result&&result.custom_bypasses)?JSON.parse(result.custom_bypasses):{},
	customBypassesList=document.getElementById("custom-bypasses-list"),
	customBypassName=document.getElementById("custom-bypass-name"),
	customBypassDomains=document.getElementById("custom-bypass-domains"),
	bypassEditor=document.getElementById("custom-bypass-editor"),
	editingBypass="",
	reloadCustomBypassList=()=>{
		customBypassesList.innerHTML=""
		customBypasses["+"]={}
		if(editingBypass)
			document.getElementById("custom-bypass-edit-container").style.display="block"
		else
			document.getElementById("custom-bypass-edit-container").style.display="none"
		for(let name in customBypasses)
		{
			let a=document.createElement("a")
			a.id="custom-bypass-"+name
			a.href="#userscripts"
			a.className="list-group-item list-group-item-action"+(editingBypass==name?" active":"")
			a.textContent=name
			a.onclick=function()
			{
				let _active=document.querySelector(".list-group-item.active")
				if(_active)
					_active.className="list-group-item list-group-item-action"
				editingBypass=this.id.substr(14)
				if(editingBypass=="+")
				{
					customBypasses[editingBypass="Untitled Bypass"]={
						domains:"example.com,example.org",
						content:'let b=document.querySelector("#button[href]")\nif(b)\n\tlocation.href=b.href\n'
					}
				}
				else
				{
					this.className="list-group-item list-group-item-action active"
				}
				customBypassName.value=editingBypass
				customBypassDomains.value=customBypasses[editingBypass].domains
				bypassEditor.textContent=customBypasses[editingBypass].content
				saveCustomBypass()
			}
			customBypassesList.appendChild(a)
		}
		delete customBypasses["+"]
	},
	saveCustomBypass=()=>{
		if(customBypassName.value!=editingBypass)
		{
			if(customBypassName.value)
			{
				customBypasses[customBypassName.value]=customBypasses[editingBypass]
				delete customBypasses[editingBypass]
				editingBypass=customBypassName.value
			}
			else
			{
				if(confirm("Do you really want to delete this bypass?"))
				{
					delete customBypasses[editingBypass]
					editingBypass=""
				}
				else
					customBypassName.value=editingBypass
			}
		}
		if(editingBypass!="")
		{
			customBypasses[editingBypass].domains=customBypassDomains.value
			customBypasses[editingBypass].content=bypassEditor.value
		}
		chrome.storage.local.set({custom_bypasses:JSON.stringify(customBypasses)},reloadCustomBypassList);
	}
	reloadCustomBypassList()
	document.getElementById("save-custom-bypass").onclick=saveCustomBypass
	document.getElementById("delete-custom-bypass").onclick=()=>{
		customBypassName.value=""
		saveCustomBypass()
	}
})
chrome.storage.sync.get(["no_tracker_bypass","allow_ip_loggers","crowd_bypass_opt_out"],result=>{
	let trackerBypassCheckbox=document.getElementById("option-tracker-bypass"),
	blockIPLoggersCheckbox=document.getElementById("option-block-ip-loggers"),
	crowdBypassCheckbox=document.getElementById("option-crowd-bypass")
	if(!result.no_tracker_bypass||result.no_tracker_bypass!=="true")
		trackerBypassCheckbox.setAttribute("checked","checked")
	if(!result.allow_ip_loggers||result.allow_ip_loggers!=="true")
		blockIPLoggersCheckbox.setAttribute("checked","checked")
	if(!result.crowd_bypass_opt_out||result.crowd_bypass_opt_out!=="true")
		crowdBypassCheckbox.setAttribute("checked","checked")
	trackerBypassCheckbox.onchange=()=>{
		trackerBypassCheckbox.setAttribute("disabled","disabled")
		chrome.storage.sync.set({
			no_tracker_bypass:(!trackerBypassCheckbox.checked).toString()
		},()=>{
			trackerBypassCheckbox.removeAttribute("disabled")
		})
	}
	blockIPLoggersCheckbox.onchange=()=>{
		blockIPLoggersCheckbox.setAttribute("disabled","disabled")
		chrome.storage.sync.set({
			allow_ip_loggers:(!blockIPLoggersCheckbox.checked).toString()
		},()=>{
			blockIPLoggersCheckbox.removeAttribute("disabled")
		})
	}
	crowdBypassCheckbox.onchange=()=>{
		crowdBypassCheckbox.setAttribute("disabled","disabled")
		chrome.storage.sync.set({
			crowd_bypass_opt_out:(!crowdBypassCheckbox.checked).toString()
		},()=>{
			crowdBypassCheckbox.removeAttribute("disabled")
		})
	}
})
