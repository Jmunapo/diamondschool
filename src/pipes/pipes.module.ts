import { NgModule } from '@angular/core';
import { TruncatePipe } from './truncate/truncate';
import { TrimHtmlPipe } from './trim-html/trim-html';
@NgModule({
	declarations: [TruncatePipe,
    TrimHtmlPipe],
	imports: [],
	exports: [TruncatePipe,
    TrimHtmlPipe]
})
export class PipesModule {}
