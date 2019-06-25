import { LightningElement, api, track } from 'lwc';

export default class LwcMultiSelect extends LightningElement {

  @api width = 100;
  @api variant = '';
  @api label = '';
  @api dropdownLength = 5;
  @api options = [{label:'Docksta table',value:'Docksta table',selected:false},
                  {label:'Ektorp sofa',value:'Ektorp sofa',selected:false},
                  {label:'Poäng armchair',value:'Poäng armchair',selected:false},
                  {label:'Kallax shelving',value:'Kallax shelving',selected:false},
                  {label:'Billy bookcase',value:'Billy bookcase',selected:false},
                  {label:'Landskrona sofa',value:'Landskrona sofa',selected:false},
                  {label:'Krippan loveseat',value:'Krippan loveseat',selected:false}];
  @track options_ = [];
  @track isOpen = false;
  @api selectedPills = [];  //seperate from values, because for some reason pills use {label,name} while values uses {label:value}

  @api
  selectedValues(){
    var values = []
    this.options_.forEach(function(option) {
      if (option.selected === true) {
        values.push(option.value);
      }
    });
    return values;
  }
  @api
  selectedObjects(){
    var values = []
    this.options_.forEach(function(option) {
      if (option.selected === true) {
        values.push(option);
      }
    });
    return values;
  }
  @api
  value(){
    return this.selectedValues().join(';')
  }


  connectedCallback() {
    //copy public attributes to private ones
    this.options_ = JSON.parse(JSON.stringify(this.options));
  }

  get labelStyle() {
    return this.variant === 'label-hidden' ? ' slds-hide' : ' slds-form-element__label ' ;
  }

  get dropdownOuterStyle(){
    return 'slds-dropdown slds-dropdown_fluid slds-dropdown_length-5' + this.dropdownLength;
  }

  get mainDivClass(){
    var style = ' slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click ';
    return this.isOpen ? ' slds-is-open ' + style : style;
  }
  get hintText(){
    if (this.selectedPills.length === 0) {
      return "Select an option...";
    }
    return "";
  }

  openDropdown(){
    this.isOpen = true;
  }
  closeDropdown(){
    this.isOpen = false;
  }

  /* following pair of functions are a clever way of handling a click outside,
     despite us not having access to the outside dom.
     see: https://salesforce.stackexchange.com/questions/255691/handle-click-outside-element-in-lwc
     I made a slight improvement - by calling stopImmediatePropagation, I avoid the setTimeout call
     that the original makes to break the event flow.
  */
  handleClick(event){
    event.stopImmediatePropagation();
    this.openDropdown();
    window.addEventListener('click', this.handleClose);
  }
  handleClose = (event) => {
    event.stopPropagation();
    this.closeDropdown();
    window.removeEventListener('click', this.handleClose);
  }

  handlePillRemove(event){
    event.preventDefault();
    event.stopPropagation();

    const name = event.detail.item.name;
    //const index = event.detail.index;

    this.options_.forEach(function(element) {
      if (element.value === name) {
        element.selected = false;
      }
    });
    this.selectedPills = this.getPillArray();
    this.despatchChangeEvent();

  }

  despatchChangeEvent() {
    const eventDetail = {value:this.value(),selectedItems:this.selectedObjects()};
    const changeEvent = new CustomEvent('change', { detail: eventDetail });
    this.dispatchEvent(changeEvent);
  }

  handleSelectedClick(event){

    var value;
    var selected;
    event.preventDefault();
    event.stopPropagation();

    const listData = event.detail;
    //console.log(listData);

    value = listData.value;
    selected = listData.selected;

    //shift key ADDS to the list (unless clicking on a previously selected item)
    //also, shift key does not close the dropdown.
    if (listData.shift) {
      this.options_.forEach(function(option) {
        if (option.value === value) {
          option.selected = selected === true ? false : true;
        }
      });
    }
    else {
      this.options_.forEach(function(option) {
        if (option.value === value) {
          option.selected = selected === "true" ? false : true;
        } else {
          option.selected = false;
        }
      });
      this.closeDropdown();
    }

    this.selectedPills = this.getPillArray();

  }

  getPillArray(){
    var pills = [];
    this.options_.forEach(function(element) {
      var interator = 0;
      if (element.selected) {
        pills.push({label:element.label, name:element.value, key: interator++});
      }
    });
    return pills;
  }

}
