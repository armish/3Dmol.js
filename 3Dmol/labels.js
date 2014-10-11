//Adapted from the text sprite example from http://stemkoski.github.io/Three.js/index.html

$3Dmol.LabelCount = 0;

/**
 * Renderable labels
 * @constructor $3Dmol.Label
 * @extends {LabelSpec}
 * @param {string} tag - Label text
 * @param {Object} parameters Label style and font specifications
 */
$3Dmol.Label = function(text, parameters) {

	this.id = $3Dmol.LabelCount++;
	this.stylespec = parameters || {};

	this.canvas = document.createElement('canvas');
	//todo: implement resizing canvas..
	this.canvas.width = 134;
	this.canvas.height = 35;
	this.context = this.canvas.getContext('2d');
	this.sprite = new $3Dmol.Sprite();
	this.text = text;

};

$3Dmol.Label.prototype = {

	constructor : $3Dmol.Label,

	setContext : function() {
		// function for drawing rounded rectangles - for Label drawing
		var roundRect = function(ctx, x, y, w, h, r, drawBorder) {

			ctx.beginPath();
			ctx.moveTo(x + r, y);
			ctx.lineTo(x + w - r, y);
			ctx.quadraticCurveTo(x + w, y, x + w, y + r);
			ctx.lineTo(x + w, y + h - r);
			ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
			ctx.lineTo(x + r, y + h);
			ctx.quadraticCurveTo(x, y + h, x, y + h - r);
			ctx.lineTo(x, y + r);
			ctx.quadraticCurveTo(x, y, x + r, y);
			ctx.closePath();
			ctx.fill();
			if(drawBorder)
				ctx.stroke();

		};

		return function() {
			
			var style = this.stylespec;
			var useScreen =  typeof(style.useScreen) == "undefined" ? false : style.useScreen;
			
			var showBackground = style.showBackground;
			if(typeof(showBackground) == "undefined") showBackground = true; //default
			var font = style.font ? style.font : "sans-serif";

			var fontSize = style.fontSize ? style.fontSize : 18;

			var fontColor = style.fontColor ? style.fontColor
					: {
						r : 255,
						g : 255,
						b : 255,
						a : 1.0
					};

			var padding = style.padding ? style.padding : 4;
			var borderThickness = style.borderThickness ? style.borderThickness
					: 0;
	
			var backgroundColor = style.backgroundColor ? style.backgroundColor
					: {
						r : 0,
						g : 0,
						b : 0,
						a : 1.0
					};
					
			var borderColor = style.borderColor ? style.borderColor
							: backgroundColor;

					
			var position = style.position ? style.position
					: {
						x : -10,
						y : 1,
						z : 1
					};
					
			//convert colors from 0-1.0 to 255
			if(backgroundColor instanceof $3Dmol.Color) backgroundColor = backgroundColor.scaled();
			if(borderColor instanceof $3Dmol.Color) borderColor = borderColor.scaled();
			if(fontColor instanceof $3Dmol.Color) fontColor = fontColor.scaled();
		

			// Should labels always be in front of model?
			var inFront = (style.inFront !== undefined) ? style.inFront	: true;

			// clear canvas

			var spriteAlignment = style.alignment || $3Dmol.SpriteAlignment.topLeft;

			var bold = "";
			if(style.bold)
				bold = "bold ";
			this.context.font = bold+fontSize + "px  " + font;

			var metrics = this.context.measureText(this.text);
			var textWidth = metrics.width;
			
			if(!showBackground) borderThickness = 0;
		
			var width = textWidth+2.5*borderThickness +2*padding;
			var height = fontSize*1.25+2*borderThickness+2*padding;			// 1.25 is extra height factor for text below baseline: g,j,p,q.

			
			if(style.backgroundImage) {
				var img = style.backgroundImage;
				var w = style.backgroundWidth ? style.backgroundWidth : img.width;
				var h = style.backgroundHeight ? style.backgroundHeight : img.height;
				if(w > width) width = w;
				if(h > height) height = h;
			}

			this.canvas.width = width;
			this.canvas.height = height;
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

			var bold = "";
			if(style.bold)
				bold = "bold ";
			this.context.font = bold+fontSize + "px  " + font;

			// background color
			this.context.fillStyle = "rgba(" + backgroundColor.r + ","
					+ backgroundColor.g + "," + backgroundColor.b
					+ "," + backgroundColor.a + ")";
			// border color
			this.context.strokeStyle = "rgba(" + borderColor.r + ","
					+ borderColor.g + "," + borderColor.b + ","
					+ borderColor.a + ")";

			this.context.lineWidth = borderThickness;
			if(showBackground) {
				roundRect(this.context, borderThickness,borderThickness , width-2*borderThickness,height-2*borderThickness, 6, borderThickness > 0);
			}
			
			if(style.backgroundImage) {
				var img = style.backgroundImage;
				var w = style.backgroundWidth ? style.backgroundWidth : img.width;
				var h = style.backgroundHeight ? style.backgroundHeight : img.height;
				this.context.drawImage(img,0,0, w, h);
			}
			

			// text color
			this.context.fillStyle = "rgba(" + fontColor.r + ","
					+ fontColor.g + "," + fontColor.b + ","
					+ fontColor.a + ")";
			
			this.context.fillText(this.text, borderThickness+padding,
					fontSize + borderThickness+padding, textWidth);

			// canvas contents will be used for a texture
			var texture = new $3Dmol.Texture(this.canvas);
			texture.needsUpdate = true;
			this.sprite.material = new $3Dmol.SpriteMaterial({
				map : texture,
				useScreenCoordinates : useScreen,
				alignment : spriteAlignment,
				depthTest : !inFront
			});

			this.sprite.scale.set(1,1,1);

			this.sprite.position.set(position.x, position.y, position.z);
		};

	}(),

	// clean up material and texture
	dispose : function() {

		if (this.sprite.material.map !== undefined)
			this.sprite.material.map.dispose();
		if (this.sprite.material !== undefined)
			this.sprite.material.dispose();
	}

};