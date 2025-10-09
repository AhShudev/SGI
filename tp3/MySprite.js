import * as THREE from 'three';

class MySprite {
    constructor(texture, columns, rows) {
        this.texture = texture;
        this.columns = columns; 
        this.rows = rows; 
        this.charWidth = 1 / columns; 
        this.charHeight = 1 / rows; 
    }

    /**
     * Gets the mapping coordinates (u, v) for an ASCII character.
     * @param {string} char - The character to map.
     * @returns {Object} - The UV coordinates for the character.
     */
    getCharUV(char) {
        const asciiCode = char.charCodeAt(0);

        const charsPerRow = Math.floor(1 / this.charWidth);

        const row = Math.floor(asciiCode / charsPerRow);
        const col = asciiCode % charsPerRow;
    
        const padding = 0.01; 
        const u = col * this.charWidth + padding;
        const v = 1 - (row + 1) * this.charHeight - padding;
    
        return { u, v };
    }
    

    /**
     * Creates a mesh for a character using the spritesheet.
     */
    createCharMesh(char, size) {
        const uv = this.getCharUV(char);

        const geometry = new THREE.PlaneGeometry(size, size);
    
        const uvAttribute = geometry.attributes.uv;
        const uvs = uvAttribute.array;
    
        uvs[0] = uv.u;
        uvs[1] = uv.v + this.charHeight;
        uvs[2] = uv.u + this.charWidth;
        uvs[3] = uv.v + this.charHeight;
        uvs[4] = uv.u;
        uvs[5] = uv.v;
    
        uvs[6] = uv.u + this.charWidth;
        uvs[7] = uv.v + this.charHeight;
        uvs[8] = uv.u + this.charWidth;
        uvs[9] = uv.v;
        uvs[10] = uv.u;
        uvs[11] = uv.v;
    
        uvAttribute.needsUpdate = true; 
    
        // Material with spritesheet texture
        const material = new THREE.MeshBasicMaterial({
            map: this.texture,
            transparent: true,
        });
    
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }
    

    /**
     * Creates text from a string.
     */
    createTextMesh(text, size, spacing) {
        const group = new THREE.Group();

        let offsetX = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const charMesh = this.createCharMesh(char, size);
            charMesh.position.x = offsetX;
            group.add(charMesh);
            offsetX += size + spacing; 
        }

        return group;
    }
}

export { MySprite };
