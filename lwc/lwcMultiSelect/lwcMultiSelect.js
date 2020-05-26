import { LightningElement, api, track } from 'lwc';

export default class LwcMultiSelect extends LightningElement {

  @api width = 100;
  @api variant = '';
  @api label = '';
  @api name = '';
  @api dropdownLength = 5;

  @track options_ = [];
  @track value_ = ''; //serialized value - ie 'CA;FL;IL' used when / if options have not been set yet
  @track isOpen = false;
  @api selectedPills = [];  //seperate from values, because for some reason pills use {label,name} while values uses {label:value}

  rendered = false;

  @api
  get options(){
    return this.options_
  }
  set options(options){
    this.rendered = false;
    this.parseOptions(options);
    this.parseValue(this.value_);
  }

  @api
  get value(){
    let selectedValues =  this.selectedValues();
    return selectedValues.length > 0 ? selectedValues.join(";") : "";
  }
  set value(value){
    this.value_ = value;
    this.parseValue(value);
    
  }

  parseValue(value){
    if (!value || !this.options_ || this.options_.length < 1){
      return;
    }
    var values = value.split(";");
    var valueSet = new Set(values);

    this.options_ = this.options_.map(function(option) {
      if (valueSet.has(option.value)){
        option.selected = true;
      }
      return option;
    });
    this.selectedPills = this.getPillArray();
  }

  parseOptions(options){
    if (options != undefined && Array.isArray(options)){
      this.options_ = JSON.parse(JSON.stringify(options)).map( (option,i) => {
        option.key = i;
        return option;
      });
    }
  }


  //private called by getter of 'value'
  selectedValues(){
    var values = [];
    //if no options set yet or invalid, just return value
    if (this.options_.length < 1){
      return this.value_;
    }
    this.options_.forEach(function(option) {
      if (option.selected === true) {
        values.push(option.value);
      }
    });
    return values;
  }

  connectedCallback() {
  }

  renderedCallback(){
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

  handleSelectedClick(event){

    var value;
    var selected;
    event.preventDefault();
    event.stopPropagation();

    const listData = event.detail;

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
    this.despatchChangeEvent();

  }


  despatchChangeEvent() {
    let values =  this.selectedValues();
    let valueString = values.length > 0 ? values.join(";") : "";
    const eventDetail = {value:valueString};
    const changeEvent = new CustomEvent('change', { detail: eventDetail });
    this.dispatchEvent(changeEvent);
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
