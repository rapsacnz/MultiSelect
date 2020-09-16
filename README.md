# lwcMultiSelect
Same as my Aura MultiSelect, except uses pills to show selected items.

# Update 2020-09-16
Salesforce changed it's design system to make pills a block display, which means they don't work inside the multiselect, so I've added a custom pill component
to this project - which means it can be used the same as before. This will be needed for all implementations of this component, as the change made by Salesforce completely breaks it. 

Just add the new pill component, and add to the multiselect in place of the pill container, and everything else is the same.

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

