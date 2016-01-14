(function($, Craft, OEmbed)
{
	var EmbedModal = Garnish.Modal.extend({

		init: function()
		{
			this.base();

			this.$form = $('<form class="modal fitted">').appendTo(Garnish.$bod);
			this.setContainer(this.$form);

			var body = $([
				'<div class="body">',
					'<div class="field">',
						'<div class="heading">',
							'<label for="oembed-url-field">', Craft.t('URL'), '</label>',
							'<div class="instructions"><p>', Craft.t('The link to the asset to embed.'), '</p></div>',
						'</div>',
						'<div class="input">',
							'<input id="oembed-url-field" type="text" class="text fullwidth">',
							'<ul id="oembed-url-errors" class="errors" style="display: none;"></ul>',
						'</div>',
					'</div>',
					'<a id="oembed-media" target="_blank" style="display: none">',
						'<div id="oembed-media-image"></div>',
						'<div id="oembed-media-content">',
							'<p id="oembed-media-title"></p>',
							'<p id="oembed-media-description"></p>',
							'<mark id="oembed-media-type"></mark>',
						'</div>',
					'</a>',
					'<div class="buttons right" style="margin-top: 0;">',
						'<div id="oembed-cancel-button" class="btn">', Craft.t('Cancel'), '</div>',
						'<input id="oembed-save-button" type="submit" class="btn submit" value="', Craft.t('Save'), '">',
					'</div>',
				'</div>'
			].join('')).appendTo(this.$form);

			this.$urlField = body.find('#oembed-url-field');
			this.$urlErrors = body.find('#oembed-url-errors');
			this.$media = body.find('#oembed-media');
			this.$mediaImage = body.find('#oembed-media-image');
			this.$mediaTitle = body.find('#oembed-media-title');
			this.$mediaDesc = body.find('#oembed-media-description');
			this.$mediaType = body.find('#oembed-media-type');
			this.$cancelBtn = body.find('#oembed-cancel-button');
			this.$saveBtn = body.find('#oembed-save-button');

			this.$urlField.prop('placeholder', 'http://');

			this.addListener(this.$urlField, 'change', 'onUrlChange');
			this.addListener(this.$cancelBtn, 'click', 'hide');
			this.addListener(this.$form, 'submit', 'onFormSubmit');

			OEmbed.on('parseUrl', $.proxy(this.onParseUrl, this));
		},

		onUrlChange: function(e)
		{
			var url = this.$urlField.val();

			OEmbed.parseUrl(url);
		},

		onParseUrl: function(e)
		{
			var media = e.media;

			if(e.success)
			{
				this.$media.prop('href', media.url);
				this.$mediaTitle.text(media.title);
				this.$mediaDesc.text(media.description);
				this.$mediaImage.css('backgroundImage', 'url(' + media.thumbnailUrl + ')');
				this.$mediaType.text(media.type);

				this.$media.css('display', '');
			}
			
			this.$media.css('display', e.success ? '' : 'none');
			this.displayErrors('url', e.errors);

			this.updateSizeAndPosition();
		},

		onFormSubmit: function(e)
		{
			e.preventDefault();

			// Prevent multi form submits with the return key
			if(!this.visible)
			{
				return;
			}

			this.trigger('embed', {
				// TODO
			});

			this.hide();
		},

		onFadeOut: function()
		{
			this.base();

			this.destroy();
		},

		destroy: function()
		{
			this.base();

			this.$container.remove();
			this.$shade.remove();
		},

		show: function()
		{
			if(!Garnish.isMobileBrowser())
			{
				setTimeout($.proxy(function()
				{
					this.$urlField.focus()
				}, this), 100);
			}

			this.base();
		},

		displayErrors: function(attr, errors)
		{
			var $input;
			var $errorList;

			switch(attr)
			{
				case 'url':
				{
					$input = this.$urlField;
					$errorList = this.$urlErrors;

					break;
				}
			}

			$errorList.children().remove();

			if(errors)
			{
				$input.addClass('error');
				$errorList.show();

				for(var i = 0; i < errors.length; i++)
				{
					$('<li>').text(errors[i]).appendTo($errorList);
				}
			}
			else
			{
				$input.removeClass('error');
				$errorList.hide();
			}
		}
	});

	OEmbed.EmbedModal = EmbedModal;

})(jQuery, Craft, OEmbed);