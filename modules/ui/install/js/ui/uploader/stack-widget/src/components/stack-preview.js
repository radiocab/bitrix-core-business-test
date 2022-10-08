import { BitrixVue } from 'ui.vue';
import { FileStatus } from 'ui.uploader.core';
import { FileIcon } from 'ui.uploader.tile-widget';

import { StackWidgetSize } from '../stack-widget-size';

const fileIconSizes = {
	[StackWidgetSize.LARGE]: 36,
	[StackWidgetSize.MEDIUM]: 27,
	[StackWidgetSize.SMALL]: 19,
	[StackWidgetSize.TINY]: 15,
}

export const StackPreview = BitrixVue.localComponent('ui.uploader.stack-widget.stack-preview', {
	components: {
		FileIcon,
	},
	props: {
		items: {
			type: Array,
			required: true,
		},
	},
	data()
	{
		return {
			menu: null,
		};
	},
	computed: {
		FileStatus: () => FileStatus,
		Sizes: () => StackWidgetSize,
		item()
		{
			const item = this.items.find(item => {
				return item.status !== FileStatus.LOAD_FAILED || item.status !== FileStatus.UPLOAD_FAILED;
			});

			return item || {};
		},
		fileIconSize()
		{
			return fileIconSizes[this.$root.widget.size];
		},
		errorsCount()
		{
			return this.items.reduce((errors, item) => {
				if (item.status === FileStatus.LOAD_FAILED || item.status === FileStatus.UPLOAD_FAILED)
				{
					return errors + 1;
				}
				else
				{
					return errors;
				}
			}, 0);
		},
	},
	// language=Vue
	template: `
		<div class="ui-uploader-stack-preview" :class="{'--image': item.isImage}" @click="$emit('showPopup')">
			<div class="ui-uploader-stack-preview-box">
				<template v-if="item.failed">
					<div class="ui-uploader-stack-preview-error"></div>
				</template>
				<template v-else-if="item.isImage">
					<div
						class="ui-uploader-stack-preview-image"
						:class="{ '--default': item.previewUrl === null }"
						:style="{ backgroundImage: item.previewUrl !== null ? 'url(' + item.previewUrl + ')' : '' }">
					</div>
					<div v-if="items.length > 1" class="ui-uploader-stack-preview-stats">
						<span class="ui-uploader-stack-preview-total">{{ items.length }}</span>
					</div>
				</template>
				<template v-else>
					<template v-if="item.name && item.status !== FileStatus.LOADING">
						<div class="ui-uploader-stack-preview-file-icon">
							<FileIcon :name="item.extension" :size="fileIconSize"/>
						</div>
						<div
							v-if="[Sizes.LARGE, Sizes.MEDIUM].includes($root.widget.size)"
							:title="item.originalName"
							class="ui-uploader-stack-preview-file-name"
						>{{
							items.length > 1
							? this.$Bitrix.Loc.getMessage('STACK_WIDGET_FILE_COUNT', { '#count#': items.length })
							: item.originalName
						}}</div>
						<div 
							v-if="items.length > 1 && [Sizes.SMALL, Sizes.TINY].includes($root.widget.size)"
							class="ui-uploader-stack-preview-stats">
							<span class="ui-uploader-stack-preview-total">{{ items.length }}</span>
						</div>
					</template>
					<template v-else>
						<div class="ui-uploader-stack-preview-file-default"></div>
					</template>
				</template>
			</div>
			<div
				class="ui-uploader-stack-upload-menu"
				:title="$Bitrix.Loc.getMessage('STACK_WIDGET_OPEN_FILE_GALLERY')"
			></div>
		</div>
	`,
});
