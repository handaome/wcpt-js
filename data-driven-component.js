export class DataDrivenComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.state = {};
        this.proxy = this.createProxy(this.state);
        this.attributeObserver = new MutationObserver(this.handleAttributeChange.bind(this));
    }

    createProxy(data) {
        const handler = {
            set: (obj, prop, value) => {
                if (obj[prop] !== value) {
                    obj[prop] = value;
                    this.reflectAttribute(prop, value);
                    this.update();
                }
                return true;
            },
        };
        return new Proxy(data, handler);
    }

    reflectAttribute(name, value) {
        if (this.getAttribute(name) !== String(value)) {
            this.setAttribute(name, value);
        }
    }

    connectedCallback() {
        this.attributeObserver.observe(this, { attributes: true });
        this.render();
    }

    disconnectedCallback() {
        this.attributeObserver.disconnect();
    }

    handleAttributeChange(mutations) {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes') {
                const name = mutation.attributeName;
                let newValue = this.getAttribute(name);
                if (name in this.state) {
                    newValue = this.convertType(newValue, typeof this.state[name]);
                }
                if (newValue !== this.proxy[name]) {
                    this.proxy[name] = newValue;
                    this.update();
                }
            }
        });
    }

    setState(newState) {
        Object.assign(this.proxy, newState);
    }

    convertType(value, targetType) {
        switch (targetType) {
            case 'number':
                return Number(value);
            case 'boolean':
                return value === 'true';
            default:
                return value;
        }
    }

    update() {
        this.render();
    }

    render() {
        // 子类实现渲染逻辑
    }
}

customElements.define('data-driven-component', DataDrivenComponent);
