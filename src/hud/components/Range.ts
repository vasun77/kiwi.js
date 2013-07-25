

module Kiwi.Components {

    
    export class Range extends Kiwi.Component {
        // Constructor
        constructor(current: number, max: number, min: number) {
            super("counter", true, true, true);
            
            this._current = current;

            this._max = max;

            this._min = min;

            this.updated = new Kiwi.Signal();
        }

        private _current: number;

        private _max: number;

        private _min: number;

        public updated: Kiwi.Signal; 

        //maximum value
        public max(val?: number) {
            if (val !== undefined) {
                this._max = val;
                this.updated.dispatch(this._current, this._max, this._min);
            }
            return this._max;
        }

        //minimum value
        public min(val?: number) {
            if (val !== undefined) {
                this._min = val;
                this.updated.dispatch(this._current, this._max, this._min);
            }
            return this._min;
        }

        //current value
        public current(val?: number) {
            if (val !== undefined) {
                if (this._current > this._max) {
                    this._current = this._max;
                } else if (this._current < this._min) {
                    this._current = this._min;
                } else {
                    this._current = val;
                }
                this.updated.dispatch(this._current, this._max, this._min);
            }
            return this._current;
        }

        //decrease the value
        public decrease(val: number= 1) {
            if (this._current > this._min) {
                if (this._current - val < this._min) {
                    this._current = this._min;
                } else {
                    this._current -= val;
                }
                this.updated.dispatch(this._current, this._max, this._min);
            }
        }

        //increase the value
        public increase(val: number= 1) {
            if (this._current < this._max) {
                if (this._current + val > this._max) {
                    this._current = this._max;
                } else {
                    this._current += val;
                }
                this.updated.dispatch(this._current, this._max, this._min);
            }
        }

        //gets the current value as a percentage of the maximum vlae
        public currentPercent(): number {
            return ((this.current()) / (this.max())) * 100;
        }
    
    }

}
