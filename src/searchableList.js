/* eslint no-undef: 0 */
const template = document.createElement('template');
template.innerHTML = `
  <style>
    * {
      box-sizing: border-box;
    }
    :host input {
      display: none;  
    }
    
    :host ul {
      margin: 10px 0 0 5px;
      padding: 0;
    }

    :host([showInput]) input {
      display: block;
      border: none;
      border-bottom: 1px dotted silver;
    }

    ::slotted(li) {
      list-style: none;
    }
  </style>
  <input type="text" placeholder="type to filter"/>
  <ul>
    <slot/>
  </ul>
`;

class SearchableList extends HTMLElement {
  get showInput() {
    return this.getAttribute('showInput');
  }

  set showInput(showInput) {
    if (showInput) {
      this.setAttribute('showInput', '');
    } else {
      this.removeAttribute('showInput', '');
    }
  }

  static get observedAttributes() {
    return ['showinput'];
  }

  constructor() {
    super();
    
    const shadowDOM = this.attachShadow({mode: 'open'});
    shadowDOM.appendChild(template.content.cloneNode(true));
    this.shadowDOM = shadowDOM;    

    shadowDOM.querySelector('input').addEventListener('keyup', this.filter.bind(this));     
  }

  attributeChangedCallback(name, oldValue, newValue) {
  }

  connectedCallback() {
    this.showInput = this.hasAttribute('showInput');
    document.querySelector('searchable-list').addEventListener('click', (e) => {
      this.addFilterAttribute(e.target)
    });
  }

  addFilterAttribute(target) {    
    if (target.nodeName.toLocaleLowerCase() !== 'searchable-list') {
      target = target.parentElement;
    }

    target.setAttribute('showInput', '');
  }

  filter() {
    const filterInput = this.shadowDOM.querySelector('input').value.toUpperCase();
    const items = this.querySelectorAll('searchable-list li');

    for (let i = 0; i < items.length; i++) {
      let txtValue = items[i].textContent || items[i].innerText;
      if (txtValue.toUpperCase().indexOf(filterInput) > -1) {
        items[i].style.display = "";
      } else {
        items[i].style.display = "none";
      }
    }
  }
}

customElements.define('searchable-list', SearchableList);