import { DataDrivenComponent } from './data-driven-component.js';

class CounterComponent extends DataDrivenComponent {
    constructor() {
        super();
        this.setState({ count: 0 });
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('click', () => {
            this.setState({ count: this.proxy.count + 1 });
            this.dispatchEvent(new CustomEvent('countChanged', {
                detail: { count: this.proxy.count }
            }));
        });
    }

    render() {
        this.innerHTML = `
            <style>
                .counter {
                    display: inline-block;
                    padding: 10px;
                    margin: 10px;
                    border: 1px solid #ccc;
                    background-color: #f9f9f9;
                    cursor: pointer;
                    user-select: none;
                }
            </style>
            <div class="counter">
                Count: ${this.proxy.count}
            </div>
            <button type="button" class="btn btn-link">Link</button>
        `;
    }
}

customElements.define('counter-component', CounterComponent);
