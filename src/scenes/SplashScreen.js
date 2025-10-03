    openLoadModal() {
        if (this.modalEl) this.modalEl.remove();
        const modal = document.createElement('div');
        modal.className = 'save-load-modal';
        const title = document.createElement('h2');
-        title.textContent = 'Load Saved Map';
+        title.textContent = 'Choose Map';
        modal.appendChild(title);
        const levels = this.storage.listLevels();
        if (levels.length === 0) {
            const p = document.createElement('p');
            p.textContent = 'No saved levels found.';
            modal.appendChild(p);
        } else {
            const list = document.createElement('ul');
            list.className = 'level-list';
            levels.forEach(name => {
                const item = document.createElement('li');
                item.className = 'level-list-item';
-                const span = document.createElement('span');
-                span.textContent = name;
-                span.onclick = () => this.loadLevelAndStart(name);
-                const del = document.createElement('button');
-                del.textContent = '✕';
-                del.onclick = (e) => { e.stopPropagation(); if (confirm(`Delete "${name}"?`)) { this.storage.deleteLevel(name); this.openLoadModal(); } };
-                const edit = document.createElement('button');
-                edit.textContent = 'Edit';
-                edit.onclick = (e) => { e.stopPropagation(); this.loadLevelAndEdit(name); };
-                item.appendChild(span);
-                item.appendChild(edit);
-                item.appendChild(del);
+                // Title span fills available space so the whole row is clickable.
+                const span = document.createElement('span');
+                span.textContent = name;
+                span.style.flex = '1';
+                span.style.cursor = 'pointer';
+                span.style.padding = '6px 8px';
+                span.onclick = () => this.loadLevelAndStart(name);
+
+                // Buttons should be fixed width (no flex) so they stay aligned on the right.
+                const edit = document.createElement('button');
+                edit.textContent = 'Edit';
+                edit.style.flex = 'none';
+                edit.onclick = (e) => { e.stopPropagation(); this.loadLevelAndEdit(name); };
+
+                const del = document.createElement('button');
+                del.textContent = '✕';
+                del.style.flex = 'none';
+                del.onclick = (e) => { e.stopPropagation(); if (confirm(`Delete "${name}"?`)) { this.storage.deleteLevel(name); this.openLoadModal(); } };
+
+                item.appendChild(span);
+                item.appendChild(edit);
+                item.appendChild(del);
                 list.appendChild(item);
             });
             modal.appendChild(list);
         }

