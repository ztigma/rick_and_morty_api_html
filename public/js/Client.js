String.prototype.PROPS = function(props) 
{
	a = this;
	Object.keys(props).forEach
    (
        function(n)
        {
            a = a.replaceAll("<!--" + n + "-->", props[n]);
            a = a.replaceAll("/*" + n + "*/", props[n]);
            a = a.replaceAll("__" + n + "__", props[n]);
        }
    )
	return a
}
String.prototype.PROPS_ARRAY = function(props) 
{
	a = this;
    let i = 0;
	props.forEach
    (
        function(n)
        {
            a = a.replaceAll("__" + i + "__", n);
            i++;
        }
    )
	return a
}
String.prototype.CAPITALICE = function()
{
    return this.charAt(0).toUpperCase() + this.slice(1);
}
HTMLOptionsCollection.prototype.filter = function(predicate)
{
    let r = [];
    for(let i = 0; i < this.length; i++)
    {
        let n = this[i];
        if(predicate(n))
        {
            r.push(n);
        }
    }
    return r;
}
window.onload = function()
{
    OnStart();
}
/**
 * @type { Array.<function> }
 */
var starts = [];
/**
 * @type { Array.<function> }
 */
var updates = [];

class IdBase
{
    constructor()
    {
        this.contando = 0;
    }
    GetId = function()
    {
        return `id_${this.contando++}`;
    }
    SetIds ()
    {
        var t = this;
        let todos = document.querySelectorAll('*');
        todos.forEach
        (
            function(n)
            {
                if(n.getAttribute('id'))
                {
                    
                }
                else
                {
                    n.setAttribute('id', t.GetId());
                }
            }
        );
    }
    Start()
    {
        this.SetIds();
    }
}
var ID = new IdBase();

function OnStart()
{
    Importar();
    ID.Start();
    starts.forEach
    (
        function(n)
        {
            n();
        }
    )
    onstart();
}
setInterval
(
    function()
    {
        updates.forEach
        (
            function(n)
            {
                n();
            }
        )
        onupdate();
    }
    ,
    1000/30
)
function onstart()
{
	let w = document.querySelectorAll('[onstart]')
	w.forEach
	(
		function(n)
		{
			let js = n.getAttribute('onstart');
			js = js.PROPS
			({
				this:n.getAttribute('id')
			})
            if(js)
            {
                eval(js);
            }
		}
	)
}
function onupdate() 
{
	var w = document.querySelectorAll('[onupdate]');
	w.forEach
    (
        function(n) 
        {
            var update = n.getAttribute('onupdate');
            update = update.PROPS
            ({
                this:n.getAttribute('id') 
            })
            if (update) 
            {
                eval(update);
            }
        }
    );
}
function Cmd(callback, method, link, body, headers) 
{
	var req = new XMLHttpRequest();
	req.open(method, link, true);
    

	req.onload = function() //cmd
	{
        //console.log(link);
		if (req.readyState != 4 || req.status != 200) 
        {
			callback(undefined);
			return;
		}
		callback(req.responseText);
	};

	if (headers) 
    {
		console.log(headers);
		headers.forEach
        (
            function(n) {
                console.log('n');
                console.log(n);
                req.setRequestHeader(n.name, n.value);
            }
        );
		
	}
	else 
    {
		req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	}

	if (typeof body == undefined) 
    {
		req.send();
	} 
    else 
    {
		req.send(body);
	}
}
/**
 * 
 * @param { String } method 
 * @param { String } link 
 * @param { Object | String } body 
 * @param { Array } headers
 */
async function async_cmd(method, link, body, headers)
{
	return new Promise
	(
		callback =>
		{
			Cmd
			(
				callback
				, 
				method
				, 
				link
				, 
				body
				, 
				headers
			)
		}
	);
}
function Importar()
{
    let w = document.querySelectorAll('[import]');
    w.forEach
    (
        function(n)
        {
            let name = n.getAttribute('import');
            let elemento = document.querySelector(`[export=${name}]`);

            //ATTRIBUTES
            elemento.getAttributeNames().forEach
            (
                function(ttr_name)
                {
                    if(ttr_name == 'import' || ttr_name == 'export' || ttr_name == 'style' || ttr_name == 'child_mode')
                    {
                        return;
                    }

                    let b = n.getAttribute(ttr_name);
                    if(b)
                    {

                    }
                    else
                    {
                        n.setAttribute(ttr_name, elemento.getAttribute(ttr_name));
                    }
                }
            );

            //STYLE
            for(let i = 0; i < elemento.style.length; i++)
            {
                let style_name = elemento.style.item(i);
                //console.log(style_name);
                let bs = n.style.getPropertyValue(style_name);
                if(bs)
                {

                }
                else
                {
                    n.style.setProperty(style_name, elemento.style.getPropertyValue(style_name));
                }
            }

            //CHILDREN
            let child_mode = n.getAttribute('child_mode');//add, replace
            if(child_mode)
            {

            }
            else
            {
                child_mode = 'replace';
                n.setAttribute('child_mode', child_mode);
            }
            child_mode = n.getAttribute('child_mode');
            if(child_mode == 'replace')
            {
                
            }
            else if(child_mode == 'add')
            {
                n.innerHTML = elemento.innerHTML + n.innerHTML;
            }
        }
    );
}