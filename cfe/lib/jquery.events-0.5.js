var Events = {
    $events: {},

    addEvent: function(type, fn, internal){
        type = Events.removeOn(type);
        if (fn != $.noop()){
            this.$events[type] = this.$events[type] || [];
            //this.$events[type].include(fn);
            for(var sfn in this.$events[type])
            {
                if(sfn == fn) delete this.$events[type][sfn];
            }
            this.$events[type].push(fn);

            if (internal) fn.internal = true;
        }
        return this;
    },

    addEvents: function(events){
        for (var type in events) this.addEvent(type, events[type]);
        return this;
    },

    fireEvent: function(type, args){
        type = Events.removeOn(type);
        if (!this.$events || !this.$events[type]) return this;

        for(var sfn in this.$events[type])
        {
            $.proxy(this.$events[type][sfn], this)(args);
        }
        
        return this;
    },

    removeEvent: function(type, fn){
        type = Events.removeOn(type);
        if (!this.$events[type]) return this;
        if (!fn.internal) this.$events[type].erase(fn);
        return this;
    },

    removeEvents: function(events){
        var type;
        if ($type(events) == 'object'){
            for (type in events) this.removeEvent(type, events[type]);
            return this;
        }
        if (events) events = Events.removeOn(events);
        for (type in this.$events){
            if (events && events != type) continue;
            var fns = this.$events[type];
            for (var i = fns.length; i--; i) this.removeEvent(type, fns[i]);
        }
        return this;
    },
    removeOn: function(string){
        return string.replace(/^on([A-Z])/, function(full, first){
            return first.toLowerCase();
        });
    }
}