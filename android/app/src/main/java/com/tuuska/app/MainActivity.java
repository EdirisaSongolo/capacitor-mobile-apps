package com.tuuska.app;

import android.os.Bundle;
import android.view.ViewGroup;
import android.webkit.WebView;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.WebViewListener;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        enablePullToRefresh();
    }

    private void enablePullToRefresh() {
        if (getBridge() == null) {
            return;
        }

        WebView webView = getBridge().getWebView();
        ViewGroup parent = (ViewGroup) webView.getParent();
        ViewGroup.LayoutParams layoutParams = webView.getLayoutParams();

        SwipeRefreshLayout swipeRefreshLayout = new SwipeRefreshLayout(this);
        parent.removeView(webView);
        swipeRefreshLayout.addView(
            webView,
            new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
        );
        parent.addView(swipeRefreshLayout, layoutParams);

        swipeRefreshLayout.setOnRefreshListener(webView::reload);

        getBridge().addWebViewListener(new WebViewListener() {
            @Override
            public void onPageLoaded(WebView view) {
                swipeRefreshLayout.setRefreshing(false);
            }

            @Override
            public void onReceivedError(WebView view) {
                swipeRefreshLayout.setRefreshing(false);
            }
        });
    }
}
