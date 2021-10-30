var buylist = [""];
var insertlist = [""];
var addtolist = true;
var changesite = true;

function store() {
    localStorage.setItem('insertproducts', JSON.stringify(insertlist));
    var fastinsert = $("#fastinsert").html();
    localStorage.setItem('fastinsert', fastinsert);
    storetobuylist();
}

function storetobuylist() {
    localStorage.setItem('products', JSON.stringify(buylist));
    var list = $("#todolist").html();
    localStorage.setItem('list', list);
    componentHandler.upgradeAllRegistered();
}

function deletestorage() {
    if(confirm('Are you sure you want to delete everything?')) {
        localStorage.clear();
        buylist =  [""];
        insertlist = [""];
        $("#todolist").empty();
        $("#fastinsert").empty();
    }
}

$(function () {
    if (localStorage.getItem('list')||localStorage.getItem('fastinsert')) {
        $('#todolist').html(localStorage.getItem('list'));
        $('#fastinsert').html(localStorage.getItem('fastinsert'));
        buylist = JSON.parse(localStorage.getItem('products'));
        insertlist = JSON.parse(localStorage.getItem('insertproducts'));
        componentHandler.upgradeAllRegistered();
    }

    var ulElements = document.querySelector('#todolist');
    ulElements.children.length !== 0 ? 'none' : changewebsite();
    

})

$(document).on('change', "input[name='foodcb']", function (e) {
    if ($(this).prop('checked')) {
        $(this).attr('checked', 'checked');
    } else {
        $(this).removeAttr('checked');
    }
    storetobuylist();
});

$(document).on("click", ".food", function(){
    if ($("#removelistbox").prop('checked')) {
        (this).remove();
        var del = [];
        del.push(this.textContent);
        insertlist = updateList(insertlist,del);
        store();
    }
    });


function addtobuylist(food) {
    alreadyInList(buylist, food);
    if (addtolist) {
        buylist.push(food);
        var listitem = `
        <li class="mdl-list__item">
        <span class="mdl-list__item-primary-content" style="color:white;">
        <i class="material-icons mdl-list__item-icon" style="color:white">label</i>
            ${food}
        </span>
        <input type="checkbox" name="foodcb" id="list-checkbox-1" class="mdl-checkbox__input"/>
        </li>
        `
            ;
        $("#todolist").append(listitem);
        todofield.value = "";
        store();
    }
    addtolist = true;
}


function addtoinsertlist(food) {
    alreadyInList(insertlist, food);
    if (addtolist) {
        insertlist.push(food);
        var listitem = `
        <div class="food" onclick="addtobuylist('${food}')">${food}</div>
        ` ;
        $("#fastinsert").append(listitem);
        todofield.value = "";
        store();
    }
    addtolist = true;
}

function alreadyInList(list, food) {
    if ($("#removelistbox").prop('checked')) {
        addtolist =false;
    }
    list.forEach(function (item) {
        if (item == food) {
            addtolist = false;
        }
    });
}

function wheretoadd(food) {
    $("#addlistbox").prop("checked") ? addtoinsertlist(food) : addtobuylist(food);
}


function deleteFromBuyList() {
    if (confirm("Bist du sicher?")){
    const checkboxes = document.querySelectorAll(`input[name="foodcb"]:checked`);
    var deletedElements = []
    checkboxes.forEach((checkbox) => {
        var text = checkbox.parentNode.parentNode.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ');
        deletedElements.push(text.slice(9, -2)); //What product does the checkbox represent
        checkbox.closest('li').remove();
    });
    buylist = updateList(buylist, deletedElements);
    storetobuylist();
}
}

function updateList(list, delElem) {
    var newlist = [];
    var del = false;
    list.forEach((n) => {
        delElem.forEach((m) => {
            if (n == m) {
                del = true;
            }
        });
        if (!del) {
            newlist.push(n);
        }
        del = false;
    });
    list = newlist;
    return list;
}

function changewebsite() {
    changesite = !changesite;
    if (changesite) {
        $("#einfügen").remove();
        var element = document.getElementById('einkaufsliste');
        element.className = 'einkaufsliste';
    } else {
        $("#main").append(htmleinfügen);
        var element = document.getElementById('einkaufsliste');
        element.className = 'addeinkaufsliste';
        $('#fastinsert').html(localStorage.getItem('fastinsert'));
    }
    componentHandler.upgradeAllRegistered();
}

var htmleinfügen = `
<div id="einfügen">
<ul class="demo-list-item mdl-list" id="fastinsert">

</ul>

<form onsubmit="wheretoadd(todofield.value); return false;">
    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input class="mdl-textfield__input" type="text" id="todofield">
      <label class="mdl-textfield__label" for="todofield" style ="color:white; font-size: small; text-align: center;">Produkt eingeben...</label>
    </div>
    <button id="savebutton" type="submit"  style="margin: 8px" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
        Speichern
    </button>
    <div>
    <div id="checkboxes">
    <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="addlistbox">
    Produkt zum schnellen hinzufügen packen?
    <input type="checkbox" id="addlistbox" class="mdl-checkbox__input" />
    </label>
    </div>
    <div id="fastinsertdel">
    <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="removelistbox">
    <input type="checkbox" id="removelistbox" class="mdl-checkbox__input" />
    Klicke auf Produkte, um sie zu löschen
    </label>
    </div>
    </div>
</form>

</div>
`
