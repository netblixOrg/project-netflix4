package features.threePages.ui.homePage;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.android_app.databinding.FragmentHomeBinding;

import features.MovieDetails.MovieDetailsActivity;
import features.threePages.CategoryWithMoviesAdapter;
import views.movies.MovieViewModel;

public class HomeFragment extends Fragment {

    private FragmentHomeBinding binding;
    private MovieViewModel movieViewModel;
    private CategoryWithMoviesAdapter movieAdapter;

    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {

        binding = FragmentHomeBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        // Initialize RecyclerView
        RecyclerView recyclerViewMovies = binding.recyclerViewMovies;
        recyclerViewMovies.setLayoutManager(new LinearLayoutManager(getContext()));

        SharedPreferences sharedPreferences = requireActivity().getSharedPreferences("user_prefs", Context.MODE_PRIVATE);
        String userId = sharedPreferences.getString("user_id", null);
        String role = sharedPreferences.getString("user_role", null);

        // ViewModel to fetch movies
        movieViewModel = new ViewModelProvider(this).get(MovieViewModel.class);
        movieViewModel.getMoviesByCategory(userId).observe(getViewLifecycleOwner(), categorizedMovies -> {
            if (categorizedMovies != null) {
                movieAdapter = new CategoryWithMoviesAdapter(categorizedMovies, movie -> {
                    Intent intent = new Intent(requireContext(), MovieDetailsActivity.class);
                    intent.putExtra("MOVIE_ID", movie.get_id());
                    intent.putExtra("USER_ID", userId);
                    startActivity(intent);
                });
                recyclerViewMovies.setAdapter(movieAdapter);
            }
        });

        return root;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
