# lwcMultiSelect
My first lwc component! Same as my other MultiSelect, except uses pills to show selected items.

To use in aura, add this markup:

    <aura:attribute name="options" type="List" default="[
                  {label:'Docksta table',value:'Docksta table',selected:false},
                  {label:'Ektorp sofa',value:'Ektorp sofa',selected:false},
                  {label:'Poäng armchair',value:'Poäng armchair',selected:false},
                  {label:'Kallax shelving',value:'Kallax shelving',selected:false},
                  {label:'Billy bookcase',value:'Billy bookcase',selected:false},
                  {label:'Landskrona sofa',value:'Landskrona sofa',selected:false},
                  {label:'Krippan loveseat',value:'Krippan loveseat',selected:false}]"/>

    <c:lwcMultiSelect label="Furniture" options="{!v.options}" onchange="{!c.handleSelectionChange}"></c:lwcMultiSelect>

Handle in the controller like this:

    handleSelectionChange(event){
      event.stopPropagation();
      const detail = event.detail;
      //semi-colon seperated string
      const selectedValue = detail.value;
    }
    
I think that's all you need.
   

In action:

[![Multiselect gif][1]][1]

[1]: https://media.giphy.com/media/l0Qlzg9JJcujQc0KrE/giphy.gif

